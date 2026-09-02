// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/site.config.ts';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  build: {
    // Emit /about/index.html style paths — clean URLs on static hosts.
    format: 'directory',
  },
  integrations: [sitemap()],
  // Zero client-side JS by default. Add islands deliberately, per-component.
});
