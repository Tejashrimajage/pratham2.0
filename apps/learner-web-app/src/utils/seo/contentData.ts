import { cache } from 'react';
import { fetchContent, hierarchyAPI } from '../API/contentService';

// React cache() dedupes within a single request, so generateMetadata and the
// page body share one API call instead of fetching twice.

export const getHierarchy = cache(async (id?: string) => {
  if (!id) return null;
  try {
    const data: any = await hierarchyAPI(id);
    return typeof data?.name === 'string' ? data : null;
  } catch {
    return null;
  }
});

export const getContent = cache(async (id?: string) => {
  if (!id) return null;
  try {
    const data: any = await fetchContent(id, { mode: null });
    return typeof data?.name === 'string' ? data : null;
  } catch {
    return null;
  }
});

const COLLECTION_MIME = 'application/vnd.ekstep.content-collection';

export const isCollection = (node: any) => node?.mimeType === COLLECTION_MIME;

/** Depth-first lookup of a node by identifier inside a hierarchy tree. */
export const findNode = (root: any, id?: string): any => {
  if (!root || !id) return null;
  if (root.identifier === id) return root;
  for (const child of root.children ?? []) {
    const match = findNode(child, id);
    if (match) return match;
  }
  return null;
};

export const childrenOf = (node: any): any[] =>
  Array.isArray(node?.children) ? node.children : [];

type TrailInput = {
  /** Site home, e.g. "/pos" or "/themantic". */
  homePath: string;
  homeName: string;
  /** Where course ids hang off: "/pos/content" or "/themantic". */
  coursePathBase: string;
  courseId?: string;
  unitId?: string;
  identifier?: string;
};

/**
 * One hierarchy call gives the course, the unit and the content, plus the
 * breadcrumb trail down to whichever level the page is at.
 */
export async function getContentTrail({
  homePath,
  homeName,
  coursePathBase,
  courseId,
  unitId,
  identifier,
}: TrailInput) {
  const course = await getHierarchy(courseId);
  const unit = findNode(course, unitId);
  const content = findNode(course, identifier);

  const coursePath = `${coursePathBase}/${courseId}`;
  const unitPath = `${coursePath}/${unitId}`;

  const crumbs = [{ name: homeName, path: homePath }];
  if (course) crumbs.push({ name: course.name, path: coursePath });
  if (unit) crumbs.push({ name: unit.name, path: unitPath });
  if (content) {
    crumbs.push({ name: content.name, path: `${unitPath}/${identifier}` });
  }

  return { course, unit, content, crumbs, coursePath, unitPath };
}
