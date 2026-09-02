/**
 * Codec for résumé selections carried in the URL as ?r=<blob>.
 *
 * The wire format is deliberately opaque: JSON -> UTF-8 -> base64url.
 * EVERYTHING that knows the format lives in this file. A future switch to
 * something more compact (an index bitmask, compression, a different schema)
 * only has to change encodeSelection/decodeSelection — no page changes.
 *
 * Bump SELECTION_VERSION when the shape changes. decodeSelection returns null
 * for anything it doesn't recognise, and callers fall back to "show everything"
 * rather than showing a broken résumé.
 */

export const SELECTION_VERSION = 1;

/** Short keys keep the encoded blob small. */
export type Selection = {
  v: number;
  s: string[]; // skills
  e: string[]; // experience
  p: string[]; // projects
  a: string[]; // awards
  /** Headline override. Absent = use the default from resume.ts. */
  h?: string;
  /** Summary/blurb override. Absent = default; empty string = hide it. */
  b?: string;
};

export type SelectionKind = 'skill' | 'experience' | 'project' | 'award';

type Bucket = 's' | 'e' | 'p' | 'a';

const BUCKET: Record<SelectionKind, Bucket> = {
  skill: 's',
  experience: 'e',
  project: 'p',
  award: 'a',
};

export function emptySelection(): Selection {
  return { v: SELECTION_VERSION, s: [], e: [], p: [], a: [] };
}

export function addToSelection(
  selection: Selection,
  kind: SelectionKind,
  id: string,
): void {
  selection[BUCKET[kind]].push(id);
}

/** Every id in the selection, flattened — handy for filtering the DOM. */
export function selectedIds(selection: Selection): Set<string> {
  return new Set([
    ...selection.s,
    ...selection.e,
    ...selection.p,
    ...selection.a,
  ]);
}

// ---- base64url helpers ---------------------------------------------------

function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToUtf8(b64: string): string {
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

const toUrlSafe = (b64: string) =>
  b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const fromUrlSafe = (s: string) => {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  return b64 + '='.repeat((4 - (b64.length % 4)) % 4); // restore padding
};

// ---- Public API ----------------------------------------------------------

export function encodeSelection(selection: Selection): string {
  return toUrlSafe(utf8ToBase64(JSON.stringify(selection)));
}

export function decodeSelection(raw: string | null | undefined): Selection | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(base64ToUtf8(fromUrlSafe(raw)));
    if (typeof parsed !== 'object' || parsed === null) return null;

    const obj = parsed as Record<string, unknown>;
    if (obj.v !== SELECTION_VERSION) return null;

    const strings = (value: unknown): string[] | null =>
      Array.isArray(value) && value.every((i) => typeof i === 'string')
        ? (value as string[])
        : null;

    const s = strings(obj.s);
    const e = strings(obj.e);
    const p = strings(obj.p);
    const a = strings(obj.a);
    if (!s || !e || !p || !a) return null;

    // Text overrides are optional; reject the blob if they're the wrong type.
    if (obj.h !== undefined && typeof obj.h !== 'string') return null;
    if (obj.b !== undefined && typeof obj.b !== 'string') return null;

    const selection: Selection = { v: SELECTION_VERSION, s, e, p, a };
    if (typeof obj.h === 'string') selection.h = obj.h;
    if (typeof obj.b === 'string') selection.b = obj.b;
    return selection;
  } catch {
    return null; // malformed base64, bad JSON, truncated link — treat as absent
  }
}
