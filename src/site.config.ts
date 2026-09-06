/**
 * Central site config. Edit this one file to change your name, tagline,
 * navigation, and the links in the footer. Content (projects, posts, links)
 * lives in src/content/ and src/data/.
 */

// TODO: set this to your real deployed URL.
// - github.io user site:   https://<username>.github.io
// - custom domain later:   https://yourdomain.com
export const SITE_URL = 'https://github.com/fennylol';

export const site = {
  title: 'Joshua "fenny" Fenneran',
  // Short tagline used in <meta description> fallbacks and on the homepage.
  tagline: '',
  author: 'fennylol',
  url: SITE_URL,
  // Used by the RSS feed and OG tags.
  description:
    'Projects, writing, and a pile of links, by Joshua "fenny" Fenneran.',
  locale: 'en',
};

/** Top-of-page navigation. Add an entry, it shows up everywhere. */
export const nav: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Résumé', href: '/resume' },
  { label: 'Blog', href: '/blog' },
  { label: 'Links', href: '/links' },
  { label: 'Now', href: '/now' },
];

/** Footer links — the "find me elsewhere" row. */
export const social: { label: string; href: string }[] = [
  { label: 'GitHub', href: 'https://github.com/fennylol' },
  { label: 'Itch.io', href: 'https://fennylol.itch.io' },
  { label: 'Email', href: 'mailto:fenny@fenneran.com' },
];
