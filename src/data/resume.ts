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
  headline: 'Electronic Design Automation Engineer',
  location: 'Poughkeepsie, NY',
  summary:
    'EDA engineer on IBM’s Clocking Optimization team. Comfortable moving ' +
    'between low-level systems work and building things end-to-end — from a ' +
    'hand-rolled operating system to game jams to this site.',
};

export const skillGroups: SkillGroup[] = [
  {
    category: 'Languages',
    skills: [
      { id: 'c', name: 'C', comfort: 'advanced' },
      { id: 'cpp', name: 'C++', comfort: 'advanced' },
      { id: 'asm', name: 'x86 Assembly', comfort: 'proficient' },
      { id: 'csharp', name: 'C#', comfort: 'working' },
      { id: 'java', name: 'Java', comfort: 'familiar' },
      { id: 'python', name: 'Python', comfort: 'proficient' },
      { id: 'gdscript', name: 'GDScript', comfort: 'advanced' },
    ],
  },
  {
    category: 'Web',
    skills: [
      { id: 'html-css', name: 'HTML / CSS', comfort: 'proficient' },
      { id: 'js-ts', name: 'JavaScript / TypeScript', comfort: 'working' },
      { id: 'react', name: 'React', comfort: 'working' },
      { id: 'node', name: 'Node.js', comfort: 'working' },
      { id: 'dotnet', name: '.NET Core', comfort: 'familiar' },
      { id: 'php', name: 'PHP', comfort: 'familiar', note: 'Laravel, at Fieldstone' },
      { id: 'astro', name: 'Astro', comfort: 'familiar', note: 'this site' },
    ],
  },
  {
    category: 'Databases',
    skills: [
      { id: 'mysql', name: 'MySQL', comfort: 'familiar' },
      { id: 'sqlite', name: 'SQLite', comfort: 'familiar' },
      { id: 'sqlserver', name: 'SQL Server', comfort: 'familiar' },
    ],
  },
  {
    category: 'Game engines',
    skills: [
      { id: 'godot', name: 'Godot', comfort: 'advanced', note: 'several personal game projects' },
      { id: 'unity', name: 'Unity', comfort: 'proficient' },
      { id: 'unreal', name: 'Unreal Engine 5', comfort: 'familiar' },
    ],
  },
  {
    category: 'Tools & platforms',
    skills: [
      { id: 'git', name: 'Git', comfort: 'proficient' },
      { id: 'linux', name: 'Linux', comfort: 'advanced' },
      { id: 'shell', name: 'Shell Scripting', comfort: 'working' },
      { id: 'gdb', name: 'GDB', comfort: 'familiar' },
      { id: 'qemu', name: 'QEMU', comfort: 'familiar' },
      { id: 'make', name: 'Make', comfort: 'familiar' },
    ],
  },
];

export const experience: ExperienceEntry[] = [
  {
    id: 'ibm-eda',
    org: 'IBM',
    role: 'Electronic Design Automation Engineer',
    location: 'Poughkeepsie, NY',
    start: 'Jun 2025',
    end: 'Present',
    summary: 'Clocking Optimization team.',
    highlights: [
      // TODO: 2-3 concrete wins from this role (what you shipped, improved,
      // debugged, or automated) — didn't want to guess at real work here.
    ],
    tags: ['EDA', 'clock optimization'],
  },
  {
    id: 'gmtk-2024',
    org: 'GMTK Game Jam 2024',
    role: 'Co-Lead Designer',
    location: 'Virtual',
    start: 'Aug 2024',
    end: 'Aug 2024',
    highlights: [
      'Co-developed a playable game with a partner and maintained reasonable ' +
        'project scope to deliver within a 96-hour time constraint.',
    ],
  },
  {
    id: 'game-exhibition-2023',
    org: 'Cedarville Game Exhibition',
    role: 'Lead Designer',
    location: 'Cedarville, OH',
    start: 'Fall 2023',
    end: 'Fall 2023',
    highlights: [
      'Developed a game using Unity and C# for an indie demo exhibition; ' +
        'gained experience with team ideation, development, and project refinement.',
    ],
  },
  {
    id: 'fieldstone',
    org: 'Fieldstone Software',
    role: 'Junior Web Developer',
    location: 'Waynesboro, VA',
    start: 'Summer 2020',
    end: 'Summer 2020',
    highlights: [
      'Worked in a development team using Laravel PHP to build, debug, and ' +
        'deploy a web-based HVAC inventory tracking, scheduling, estimating, ' +
        'and billing application.',
    ],
  },
];

export const awards: Award[] = [
  {
    id: 'bs-cs',
    title: 'B.S. Computer Science',
    issuer: 'Cedarville University',
    date: 'May 2025',
    note: 'ABET-accredited · GPA 3.85 (final two years)',
  },
  {
    id: 'deans-list',
    title: "Dean's List",
    issuer: 'Cedarville University',
    date: 'Spring 2023 – Fall 2024',
    note: 'Spring 2023, Fall 2023, Spring 2024, Fall 2024',
  },
];

/**
 * Projects pulled from src/content/projects/ by slug (filename without .md),
 * so there's a single source of truth. Add optional résumé-specific bullet
 * points per project.
 */
export const resumeProjects: { slug: string; highlights?: string[] }[] = [
  {
    slug: 'shomp-os',
    highlights: [
      'In a team of four, designed and developed a simple operating system ' +
        'in C and x86 assembly to explore core OS features and low-level ' +
        'programming concepts.',
    ],
  },
  { slug: 'the-grand-wizard-perilacks' },
  { slug: 'tournamancy' },
  { slug: 'one-true-pingus' },
  { slug: 'date-night' },
  { slug: 'fennylol-portfolio' },
];
