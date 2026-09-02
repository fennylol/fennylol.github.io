# person_website

Personal site + portfolio. Astro, hand-written CSS, zero client-side JS by
default. Builds to static files.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # -> dist/
npm run preview    # serve the built site
npm run check      # type + content-schema check
```

## Where things live

| You want to change…            | Edit…                                   |
| ------------------------------ | --------------------------------------- |
| Name, tagline, nav, footer     | `src/site.config.ts`                    |
| Colors, fonts, spacing         | `src/styles/tokens.css`                 |
| Global element styles / prose  | `src/styles/global.css`                 |
| A project                      | `src/content/projects/<slug>.md`        |
| A blog post                    | `src/content/blog/<slug>.md`            |
| The link roll                  | `src/data/links.ts`                     |
| The /now page                  | `src/pages/now.astro`                   |
| Deployed URL (RSS, OG, sitemap)| `SITE_URL` in `src/site.config.ts`      |

Add a project or post = drop in one Markdown file. Frontmatter is validated
against the schema in `src/content.config.ts` at build time — a typo fails the
build instead of shipping.

`draft: true` hides an entry from `npm run build` but keeps it visible in
`npm run dev`.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.

1. Push this repo to GitHub.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Set `SITE_URL` in `src/site.config.ts` to your Pages URL
   (`https://<username>.github.io`) and update `public/robots.txt`.

Private `<username>.github.io` repos need GitHub Pro to publish. Options:
develop in a private repo, then make it public at launch; or use a normal repo
name with a custom domain.

### Custom domain later

Add a `public/CNAME` file containing just your domain, point DNS at GitHub
Pages, update `SITE_URL`.

## Ideas for later (Phase 3)

- Dark-mode toggle (tokens already support `prefers-color-scheme`)
- Tag filter pages for projects/blog
- Static search with [Pagefind](https://pagefind.app) — runs at build, no server
- Webmentions / a guestbook (needs a service or one serverless function)
- Web ring / friends' "latest post" feed
