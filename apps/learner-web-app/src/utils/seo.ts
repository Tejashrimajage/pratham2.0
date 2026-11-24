// Canonical origins for absolute SEO URLs (sitemap, robots, canonical, og:image).
// One build serves POS, Experimento India and other tenant domains, so the site is
// resolved from the request host rather than a per-deployment environment variable.

const stripTrailingSlash = (url: string) => url.replace(/\/+$/, '');

export interface SiteConfig {
  key: 'pos' | 'experimento' | 'pos-test' | 'experimento-test';
  /** Hosts this site answers on. Anything not listed is not a site at all. */
  hosts: string[];
  /**
   * false for test hosts: they still serve a real robots.txt and sitemap so the
   * output can be checked, but every response carries X-Robots-Tag: noindex.
   * Allowing the crawl is what lets a crawler SEE the noindex — a blanket
   * Disallow hides it, and the URL can then still surface without content.
   */
  indexable: boolean;
  /** Absolute origin used in canonical and sitemap URLs. */
  origin: string;
  /** Where course ids hang off: POS nests under /pos/content, Experimento does not. */
  coursePathBase: string;
  staticPaths: { path: string; priority: number }[];
  /**
   * Search filter selecting only this site's courses. POS has none on purpose:
   * most courses carry no `program` value, so filtering would drop almost all of them.
   */
  programFilter?: string;
}

const POS_PATHS = [
  { path: '/', priority: 1 },
  { path: '/pos', priority: 0.9 },
  { path: '/pos/school', priority: 0.8 },
  { path: '/pos/work', priority: 0.8 },
  { path: '/pos/life', priority: 0.8 },
  { path: '/pos/program', priority: 0.8 },
  { path: '/pos/about-us', priority: 0.3 },
  { path: '/pos/terms-and-conditions', priority: 0.3 },
];

const EXPERIMENTO_PATHS = [
  { path: '/', priority: 1 },
  { path: '/themantic', priority: 0.9 },
];

const SITES: SiteConfig[] = [
  {
    key: 'pos',
    indexable: true,
    hosts: ['prathamopenschool.org', 'www.prathamopenschool.org'],
    origin: stripTrailingSlash(
      process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
        'https://www.prathamopenschool.org'
    ),
    coursePathBase: '/pos/content',
    staticPaths: POS_PATHS,
  },
  {
    key: 'experimento',
    indexable: true,
    hosts: ['experimentoindia.prathamopenschool.org'],
    origin: 'https://experimentoindia.prathamopenschool.org',
    coursePathBase: '/themantic',
    staticPaths: EXPERIMENTO_PATHS,
    programFilter: 'Experimento India',
  },
  // Test hosts: same output as production but on their own origin and never indexed.
  // They exist so QA can verify robots.txt, the sitemap and link previews.
  {
    key: 'pos-test',
    indexable: false,
    hosts: ['qa-pos.prathamdigital.org', 'dev-pos.prathamdigital.org'],
    origin: 'https://qa-pos.prathamdigital.org',
    coursePathBase: '/pos/content',
    staticPaths: POS_PATHS,
  },
  {
    key: 'experimento-test',
    indexable: false,
    hosts: ['qa-themantic.prathamdigital.org', 'dev-themantic.prathamdigital.org'],
    origin: 'https://qa-themantic.prathamdigital.org',
    coursePathBase: '/themantic',
    staticPaths: EXPERIMENTO_PATHS,
    programFilter: 'Experimento India',
  },
];

const normaliseHost = (host?: string | null) =>
  (host ?? '').split(':')[0].trim().toLowerCase();

/** The site this request belongs to, test hosts included, or null if unknown. */
export const siteForHost = (host?: string | null): SiteConfig | null => {
  const needle = normaliseHost(host);
  if (!needle) return null;
  return SITES.find((site) => site.hosts.includes(needle)) ?? null;
};

/** True only for the live domains. Test hosts resolve to a site but are never indexable. */
export const isIndexableHost = (host?: string | null) =>
  siteForHost(host)?.indexable === true;

export const absoluteUrl = (path = '/', origin = SITES[0].origin) =>
  `${origin}${path.startsWith('/') ? path : `/${path}`}`;

/** POS origin. Kept for callers that run outside a request and cannot read the host. */
export const SITE_URL = SITES[0].origin;
