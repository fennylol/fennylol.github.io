/**
 * Codec for résumé selections carried in the URL as ?r=<blob>.
 *
 * The wire format is a packed byte buffer, not JSON: a version byte, a flags
 * byte, then one section per content kind (skills, experience, projects,
 * awards), then optional headline/summary text — all base64url-encoded. A
 * JSON array listing every selected id by name got enormous for a full
 * résumé (~40 items); a bitmask over a known, ordered universe of ids costs
 * a handful of bytes no matter how much of it is selected.
 *
 * Each kind's section stores its own item count and mask, sized to however
 * many items existed *when that link was made* — not re-derived from live
 * resume.ts content at decode time. That's what makes old links durable:
 * decoding always reads the exact byte layout the link was encoded with, so
 * appending new items to a category (the normal way to edit resume.ts)
 * never shifts anything an old link depends on — the new items just don't
 * exist in that link's mask and decode as unselected. A section is only
 * ever invalidated by editing existing entries in place: reordering,
 * deleting, or inserting into the middle of a category (rather than at the
 * end) shifts what each bit position means, same as it always would.
 * Because every section carries its own explicit count, a decode either
 * lines up exactly or fails a bounds check and falls back cleanly to "show
 * everything" — never a silently-misaligned read.
 *
 * "Everything selected" — the common case, since that's the default view —
 * gets its own flag that skips all of the above entirely, rather than
 * encoding a bitmask of all 1s, which base64 turns into a conspicuous run
 * of "_" (0xFF bytes -> "/" in standard base64 -> "_" once made URL-safe).
 *
 * The "universe" is whatever id/kind pairs the calling page hands in — both
 * the builder and the viewer derive it from the DOM's [data-rid]/[data-kind]
 * order, which mirrors resume.ts's authored order.
 *
 * Bump SELECTION_VERSION when the byte layout changes. decodeSelection
 * returns null for anything it doesn't recognise, and callers fall back to
 * "show everything" rather than showing a broken résumé.
 */

const SELECTION_VERSION = 3;

const FLAG_HEADLINE = 1 << 0;
const FLAG_SUMMARY = 1 << 1;
const FLAG_ALL_SELECTED = 1 << 2;

/** Fixed section order — must never change without bumping the version. */
const KINDS = ['skill', 'experience', 'project', 'award'] as const;

export type IdEntry = { id: string; kind: string };

export type Selection = {
  /** Every included id, from whatever entries list decoded it. */
  keep: Set<string>;
  /** Headline override. Absent = use the default from resume.ts. */
  h?: string;
  /** Summary/blurb override. Absent = default; empty string = hide it. */
  b?: string;
};

function idsByKind(entries: IdEntry[]): Record<string, string[]> {
  const byKind: Record<string, string[]> = {};
  for (const kind of KINDS) byKind[kind] = [];
  for (const { id, kind } of entries) {
    (byKind[kind] ??= []).push(id);
  }
  return byKind;
}

// ---- base64url helpers (operate on raw bytes, not text) ------------------

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function concatBytes(pieces: Uint8Array[]): Uint8Array {
  const total = pieces.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const piece of pieces) {
    out.set(piece, offset);
    offset += piece.length;
  }
  return out;
}

// ---- Public API ----------------------------------------------------------

/**
 * @param entries Every selectable id with its kind, in the same order the
 *   decoding page will use — pass the page's own [data-rid]/[data-kind]
 *   order (deduped).
 * @param keep Which of those ids are selected.
 */
export function encodeSelection(
  entries: IdEntry[],
  keep: Set<string>,
  overrides: { h?: string; b?: string } = {},
): string {
  const allSelected = entries.length > 0 && entries.every((e) => keep.has(e.id));

  const encoder = new TextEncoder();
  const hBytes = overrides.h !== undefined ? encoder.encode(overrides.h) : null;
  const bBytes = overrides.b !== undefined ? encoder.encode(overrides.b) : null;
  const flags =
    (hBytes ? FLAG_HEADLINE : 0) |
    (bBytes ? FLAG_SUMMARY : 0) |
    (allSelected ? FLAG_ALL_SELECTED : 0);

  const pieces: Uint8Array[] = [Uint8Array.from([SELECTION_VERSION, flags])];

  if (!allSelected) {
    const byKind = idsByKind(entries);
    for (const kind of KINDS) {
      const ids = byKind[kind];
      const maskBytes = new Uint8Array(Math.ceil(ids.length / 8));
      ids.forEach((id, i) => {
        if (keep.has(id)) maskBytes[i >> 3] |= 1 << (i & 7);
      });
      pieces.push(Uint8Array.from([ids.length & 0xff, (ids.length >> 8) & 0xff]));
      pieces.push(maskBytes);
    }
  }

  const pushText = (bytes: Uint8Array) => {
    pieces.push(Uint8Array.from([bytes.length & 0xff, (bytes.length >> 8) & 0xff]));
    pieces.push(bytes);
  };
  if (hBytes) pushText(hBytes);
  if (bBytes) pushText(bBytes);

  return bytesToBase64Url(concatBytes(pieces));
}

export function decodeSelection(
  raw: string | null | undefined,
  entries: IdEntry[],
): Selection | null {
  if (!raw) return null;
  try {
    const bytes = base64UrlToBytes(raw);
    if (bytes.length < 2) return null;
    if (bytes[0] !== SELECTION_VERSION) return null;

    const flags = bytes[1];
    let offset = 2;
    const keep = new Set<string>();

    if (flags & FLAG_ALL_SELECTED) {
      for (const { id } of entries) keep.add(id);
    } else {
      const byKind = idsByKind(entries);
      for (const kind of KINDS) {
        if (bytes.length < offset + 2) return null;
        const count = bytes[offset] | (bytes[offset + 1] << 8);
        offset += 2;
        const maskLength = Math.ceil(count / 8);
        if (bytes.length < offset + maskLength) return null;
        const maskBytes = bytes.subarray(offset, offset + maskLength);
        offset += maskLength;

        const ids = byKind[kind];
        const n = Math.min(count, ids.length);
        for (let i = 0; i < n; i++) {
          if (maskBytes[i >> 3] & (1 << (i & 7))) keep.add(ids[i]);
        }
      }
    }

    const decoder = new TextDecoder();
    const readText = (): string | null => {
      if (offset + 2 > bytes.length) return null;
      const len = bytes[offset] | (bytes[offset + 1] << 8);
      offset += 2;
      if (offset + len > bytes.length) return null;
      const text = decoder.decode(bytes.subarray(offset, offset + len));
      offset += len;
      return text;
    };

    const selection: Selection = { keep };
    if (flags & FLAG_HEADLINE) {
      const h = readText();
      if (h === null) return null;
      selection.h = h;
    }
    if (flags & FLAG_SUMMARY) {
      const b = readText();
      if (b === null) return null;
      selection.b = b;
    }
    return selection;
  } catch {
    return null; // malformed base64, truncated link — treat as absent
  }
}
