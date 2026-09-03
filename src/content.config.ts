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
     * <title>, OG tags, RSS and the résumé, which all want the short form.
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
    featured: z.boolean().default(false),
    // Hide from the built site without deleting the file.
    hidden: z.boolean().default(false),
  }),
});

/**
 * Blog — writing. One Markdown file per post in src/content/blog/.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    /** Same deal as a project's: display-only second line, kept out of
     *  `title` so the <title>, OG tags and RSS keep the short form. */
    subtitle: z.string().optional(),
    summary: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    hidden: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };
