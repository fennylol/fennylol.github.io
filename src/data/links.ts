/**
 * The link roll. Add a section, add a link — it renders on /links.
 * This is the "web 1.0 blogroll" surface: friends' sites, tools you like,
 * things worth pointing at.
 */

export type Link = {
  title: string;
  href: string;
  // Optional one-liner shown next to the link.
  note?: string;
};

export type LinkSection = {
  heading: string;
  // Optional blurb under the heading.
  intro?: string;
  links: Link[];
};

export const linkSections: LinkSection[] = [
  {
    heading: 'other works',
    links: [
      { title: 'GitHub',  href: 'https://github.com/fennylol', note: 'idek if any repos are public if I\'m honest'},
      { title: 'Itch.io', href: 'https://fennylol.itch.io',    note: 'game jam game done with my brother (Polytope Party)'},
      { title: 'Email',   href: 'mailto:fenny@fenneran.com',   note: 'email (email)'},
    ],
  },
  {
    heading: 'social network',
    links: [
      { title: "Polytope Party", href: 'https://polytope.party', note: 'a slowly-growing collection of everything he\'s ever created.' },
    ],
  },
  {
    heading: 'built with',
    links: [
      {
        title: 'Astro',
        href: 'https://astro.build',
        note: 'the framework',
      },
      {
        title: 'Catppuccin',
        href: 'https://catppuccin.com',
        note: 'the colour palette',
      },
      {
        title: 'Claude Code',
        href: 'https://claude.com/claude-code',
        note: 'the coding agent',
      },
    ],
  },
];
