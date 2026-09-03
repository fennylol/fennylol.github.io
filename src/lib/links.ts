/**
 * Link policy: anything that leaves the site opens in a new tab, so a visitor
 * poking at a repo or an itch page doesn't lose their place here.
 *
 * `mailto:` and root-relative paths deliberately count as internal — a new tab
 * is pointless for the first and unwanted for the second.
 *
 * Markdown prose is handled by the matching rehype pass in astro.config.mjs;
 * keep the two in step.
 */
export const isExternal = (href: string): boolean => /^https?:\/\//i.test(href);

/** Spread onto an <a>: `<a href={href} {...externalAttrs(href)}>`. */
export const externalAttrs = (href: string) =>
  isExternal(href)
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};
