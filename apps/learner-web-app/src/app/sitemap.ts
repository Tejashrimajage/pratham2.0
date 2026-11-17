import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { absoluteUrl, isIndexableHost } from '@learner/utils/seo';
import { collectContentEntries } from '@learner/utils/sitemapSources';

// Rebuilt daily rather than per request: this walks every course hierarchy.
export const revalidate = 86400;

// Google rejects a sitemap over 50,000 URLs.
const MAX_URLS = 50000;

const STATIC_PATHS = [
  { path: '/', priority: 1 },
  { path: '/pos', priority: 0.9 },
  { path: '/pos/school', priority: 0.8 },
  { path: '/pos/work', priority: 0.8 },
  { path: '/pos/life', priority: 0.8 },
  { path: '/pos/program', priority: 0.8 },
  { path: '/pos/about-us', priority: 0.3 },
  { path: '/pos/terms-and-conditions', priority: 0.3 },
];

// lastModified comes from content metadata, never from the build time, or every
// rebuild tells Google the whole site changed.
const safeDate = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Never advertise production URLs from a dev, QA or other tenant host.
  if (!isIndexableHost(headers().get('host'))) {
    return [];
  }

  const staticEntries = STATIC_PATHS.map(({ path, priority }) => ({
    url: absoluteUrl(path),
    changeFrequency: 'weekly' as const,
    priority,
  }));

  const contentEntries = (await collectContentEntries())
    .slice(0, MAX_URLS - staticEntries.length)
    .map((entry) => ({
      url: absoluteUrl(entry.path),
      lastModified: safeDate(entry.lastModified),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    }));

  return [...staticEntries, ...contentEntries];
}
