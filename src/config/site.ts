/** Site-wide constants. Rename the product here; nothing else hard-codes it. */
export const site = {
  name: 'Stackwright',
  tagline: 'Test automation architecture, composed.',
  description:
    'Compose the right test automation stack for your application, with the when, why and how behind every choice.',
  repo: 'https://github.com/theobreorg/automation',
} as const;

/** Prefix an internal path with the configured base (e.g. "/automation" on GitHub Pages). */
export function href(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (/^(https?:|mailto:|#)/.test(path)) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export const nav = [
  { label: 'Composer', href: '/composer' },
  { label: 'Tools', href: '/tools' },
  { label: 'Patterns', href: '/patterns' },
  { label: 'Practices', href: '/practices' },
  { label: 'Guides', href: '/guides' },
  { label: 'Principles', href: '/principles' },
] as const;
