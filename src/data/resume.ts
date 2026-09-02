/**
 * Résumé content. Everything the /resume page renders comes from here.
 *
 * Design note on skills: the scale deliberately tops out at "advanced", not
 * "expert". The point is to communicate real comfort without overclaiming —
 * using something daily earns "advanced", not "expert".
 */

// ---- Skill comfort scale --------------------------------------------------

export const comfortLevels = {
  familiar: {
    rank: 1,
    label: 'Familiar',
    blurb: 'Have used it; productive with documentation at hand.',
  },
  working: {
    rank: 2,
    label: 'Knowledgeable',
    blurb: 'Use it regularly for real tasks.',
  },
  proficient: {
    rank: 3,
    label: 'Proficient',
    blurb: 'Comfortable and productive without hand-holding.',
  },
  advanced: {
    rank: 4,
    label: 'Advanced',
    blurb: 'Deep working knowledge — and aware of how much is left to learn.',
  },
  expert: {
    rank: 5,
    label: 'Expert',
    blurb: 'Extreme knowledge and capability.'
  }
} as const;

export type Comfort = keyof typeof comfortLevels;

/**
 * How many dots ComfortMeter draws. The scale is 1–5, but nothing uses rank 5
 * yet — it's reserved. Every skill therefore shows at least one empty dot,
 * which is a feature: it signals "still room to grow", not false modesty.
 */
export const comfortDotCount = 5;

// ---- Types ---------------------------------------------------------------

export type Skill = {
  /** Stable id used by the résumé builder's share links. Don't reuse or
   *  rename these once a link is out in the world. */
  id: string;
  name: string;
  comfort: Comfort;
  /** Optional context, e.g. "daily driver at work", "3 years". */
  note?: string;
};

export type SkillGroup = {
  category: string;
  skills: Skill[];
};

export type ExperienceEntry = {
  id: string;
  org: string;
  role: string;
  location?: string;
  start: string; // free text so you control the format, e.g. "Jan 2024"
  end: string; // e.g. "Present"
  summary?: string;
  highlights: string[];
  tags?: string[];
};

export type Award = {
  id: string;
  title: string;
  issuer?: string;
  date: string;
  note?: string;
  url?: string;
};

// ---- Content ------------------------------------------------------------

export const basics = {
  headline: 'Software developer',
  location: 'City, Country',
  summary:
    'One short paragraph: what you do, what you care about, what kind of work ' +
    'you want more of. Keep it to two or three sentences.',
};

export const skillGroups: SkillGroup[] = [
  {
    category: 'Languages',
    skills: [
      { id: 'cpp', name: 'C++', comfort: 'advanced', note: 'daily driver at work' },
      { id: 'python', name: 'Python', comfort: 'proficient' },
      { id: 'js-ts', name: 'JavaScript / TypeScript', comfort: 'working' },
      { id: 'sql', name: 'SQL', comfort: 'familiar' },
      { id: 'gdscript', name: 'GDscript', comfort: 'advanced' },
    ],
  },
  {
    category: 'Web',
    skills: [
      { id: 'html-css', name: 'HTML / CSS', comfort: 'proficient' },
      { id: 'react', name: 'React', comfort: 'working' },
      { id: 'astro', name: 'Astro', comfort: 'familiar', note: 'this site' },
    ],
  },
  {
    category: 'Tools & platforms',
    skills: [
      { id: 'git', name: 'Git', comfort: 'proficient' },
      { id: 'linux', name: 'Linux', comfort: 'working' },
      { id: 'docker', name: 'Docker', comfort: 'familiar' },
    ],
  },
];

export const experience: ExperienceEntry[] = [
  {
    id: 'acme-swe',
    org: 'Acme Corp',
    role: 'Software Engineer',
    location: 'Remote',
    start: 'Jan 2024',
    end: 'Present',
    summary: 'One line on the team and what it ships.',
    highlights: [
      'Accomplishment with a concrete result — numbers if you have them.',
      'Another one. Lead with the verb: built, shipped, cut, automated.',
      'A third, showing range (a different kind of work than the first two).',
    ],
    tags: ['C++', 'distributed systems'],
  },
  {
    id: 'previous-role',
    org: 'Previous Company',
    role: 'Junior Developer',
    start: 'Jun 2022',
    end: 'Dec 2023',
    highlights: [
      'What you owned and what changed because you owned it.',
      'Something you learned to do here that you now do well.',
    ],
  },
];

export const awards: Award[] = [
  {
    id: 'deans-list',
    title: "Dean's List",
    issuer: 'Your University',
    date: '2021–2023',
  },
  {
    id: 'some-cert',
    title: 'A Certificate You Actually Earned',
    issuer: 'Issuing Body',
    date: 'Mar 2024',
    note: 'One line on what it covered, if it is not obvious from the name.',
    url: 'https://example.com/verify/abc123',
  },
];

/**
 * Projects pulled from src/content/projects/ by slug (filename without .md),
 * so there's a single source of truth. Add optional résumé-specific bullet
 * points per project.
 */
export const resumeProjects: { slug: string; highlights?: string[] }[] = [
  {
    slug: 'example-project',
    highlights: [
      'A résumé-specific bullet about this project.',
      'What it demonstrates about how you work.',
    ],
  },
  { slug: 'second-project' },
];
