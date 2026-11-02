export type SiteVariant = 'pos' | 'thematic';

// One build serves both sites; this env var decides which one this deployment is.
const variant: SiteVariant =
  process.env.NEXT_PUBLIC_SITE_VARIANT === 'thematic' ? 'thematic' : 'pos';

// Domain env vars carry a trailing slash; canonical URLs must not.
const stripSlash = (url = '') => url.replace(/\/+$/, '');

const DOMAIN: Record<SiteVariant, string> = {
  pos: stripSlash(process.env.NEXT_PUBLIC_POS_DOMAIN),
  thematic: stripSlash(process.env.NEXT_PUBLIC_THEMATIC_DOMAIN),
};

const SITE_DETAILS = {
  pos: {
    name: 'Pratham Open School',
    pathPrefix: '/pos',
    foreignPrefix: '/themantic',
    ogLocale: 'en_IN',
  },
  thematic: {
    name: 'Experimento India',
    pathPrefix: '/themantic',
    foreignPrefix: '/pos',
    ogLocale: 'en_IN',
  },
} as const;

export const siteConfig = {
  variant,
  baseUrl: DOMAIN[variant],
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true',
};

export const SITE = SITE_DETAILS[variant];

// Absolute URL for canonical tags, OG tags and sitemap entries.
export const absoluteUrl = (path = '/') =>
  `${siteConfig.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
