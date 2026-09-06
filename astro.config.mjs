// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/site.config.ts';

/**
 * Off-site links in Markdown prose open in a new tab, matching what
 * src/lib/links.ts does for links built in components. Hand-rolled rather
 * than pulling in rehype-external-links — it's a dozen lines, and this is the
 * only Markdown transform the site needs.
 */
function externalLinksInNewTab() {
  /** @param {any} node */
  const visit = (node) => {
    if (node.tagName === 'a' && /^https?:\/\//i.test(node.properties?.href ?? '')) {
      node.properties.target = '_blank';
      node.properties.rel = 'noopener noreferrer';
    }
    for (const child of node.children ?? []) visit(child);
  };
  return /** @param {any} tree */ (tree) => visit(tree);
}

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  markdown: {
    rehypePlugins: [externalLinksInNewTab],
    // Catppuccin, matching the site's Latte/Mocha themes. Astro emits both
    // palettes on every token (color + --shiki-dark); src/styles/global.css
    // activates the dark set whenever the dark theme is in effect.
    shikiConfig: {
      themes: { light: 'catppuccin-latte', dark: 'catppuccin-mocha' },
    },
  },
  build: {
    // Emit /about/index.html style paths — clean URLs on static hosts.
    format: 'directory',
  },
  integrations: [sitemap()],
  // Zero client-side JS by default. Add islands deliberately, per-component.
});
