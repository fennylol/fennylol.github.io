/**
 * Central site config. Edit this one file to change your name, tagline,
 * navigation, and the links in the footer. Content (projects, posts, links)
 * lives in src/content/ and src/data/.
 */

// TODO: set this to your real deployed URL.
// - github.io user site:   https://<username>.github.io
// - custom domain later:   https://yourdomain.com
export const SITE_URL = 'https://fennylol.github.io';

// The name, split into parts so Nav can style just the middle one — change
// any of these three and every place the full name appears updates too.
const firstName = 'Joshua';
const highlight = '"fenny"';
const lastName = 'Fenneran';
const fullName = `${firstName} ${highlight} ${lastName}`;

export const site = {
  firstName,
  highlight,
  lastName,
  title: fullName,
  // Short tagline used in <meta description> fallbacks and on the homepage.
  tagline: '',
  author: 'fennylol',
  url: SITE_URL,
  // Used by OG tags.
  description: `Projects, writing, and a pile of links, by ${fullName}.`,
  locale: 'en',
};

/** Top-of-page navigation. Add an entry, it shows up everywhere. */
export const nav: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Write-ups', href: '/blog' },
  { label: 'AI Policy', href: '/ai' },
  { label: 'Links', href: '/links' },
  { label: 'Résumé', href: '/resume' },
];

/** Footer links — the "find me elsewhere" row. */
export const social: { label: string; href: string }[] = [
  { label: 'GitHub', href: 'https://github.com/fennylol' },
  { label: 'Itch.io', href: 'https://fennylol.itch.io' },
  { label: 'Email', href: 'mailto:fenny@fenneran.com' },
];
