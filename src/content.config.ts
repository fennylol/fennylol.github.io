import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Projects — portfolio entries. Each is one Markdown file in
 * src/content/projects/. The schema is validated at build time, so a
 * missing date or a typo'd field fails the build instead of shipping broken.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    /**
     * Optional display-only second line, e.g. "(and the Tower He Intends to
     * Build)". Kept out of `title` on purpose: `title` feeds the page
     * <title>, OG tags and the résumé, which all want the short form.
     */
    subtitle: z.string().optional(),
    // One- or two-sentence blurb shown on the card and in listings.
    summary: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // Lifecycle badge shown on the card. z.enum([...]) also becomes a
    // TypeScript union of exactly these strings, automatically — so changing
    // this list will flag any code still checking for an old value.
    status: z.enum(['in development :]', 'completed :3', 'live :O', 'abandoned :[']).default('in development :]'),
    /**
     * Generative-AI disclosure, shown as a labelled badge (not a tag).
     * Required, and deliberately without a default — every project has to
     * state where it stands, and a missing value fails the build rather
     * than quietly going undisclosed.
     */
    genai: z.enum(['none', 'some', 'used']),
    // Optional outbound links shown on the project.
    source: z.string().url().optional(), // source code
    // Live demo / site. Usually an absolute URL, but a root-relative path
    // (e.g. "/") is allowed too — for the rare project that just *is* this
    // site, linking to its own homepage.
    link: z.string().optional(),
    /**
     * Downloadable artifacts: builds, binaries, papers, asset packs.
     * `href` is either a local path (drop the file in public/, e.g.
     * "/downloads/game-win.zip") or an absolute URL. For anything more than
     * a few MB prefer a GitHub Release asset over committing it to the repo.
     * Add more than one entry for multi-platform builds.
     */
    downloads: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
          note: z.string().optional(), // e.g. "Windows · 24 MB"
        }),
      )
      .default([]),
    // Pin to the top of listings / show on the homepage.
    favorite: z.boolean().default(false),
    // Drop from production builds without deleting the file. Still shows
    // in `astro dev` so it can be previewed.
    hidden: z.boolean().default(false),
  })
    // Unknown keys fail the build, so a misspelt flag can't silently do
    // nothing (this happened: files said `draft:`, the flag is `hidden:`).
    .strict(),
});

/**
 * Blog — writing. One Markdown file per post in src/content/blog/.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    // One- or two-sentence blurb. Feeds the <meta description> and OG tags,
    // and shows as the lede under the title on the post itself and in
    // listings. (Posts have no separate subtitle — the summary does that job.)
    summary: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // Pin to the top of the write-ups list / show on the homepage.
    favorite: z.boolean().default(false),
    hidden: z.boolean().default(false),
  }).strict(),
});

export const collections = { projects, blog };
