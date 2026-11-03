import { fetchContent, hierarchyAPI } from './contentService';
import { buildMetadata } from '../seo/buildMetadata';

type MetadataOptions = {
  /** Path on this site, used for the canonical URL. */
  path?: string;
  type?: 'website' | 'article' | 'video.other';
  noindex?: boolean;
};

export async function getMetadata(
  identifier: any,
  unitId?: any,
  options: MetadataOptions = {}
) {
  let product: any;
  try {
    product = unitId
      ? await hierarchyAPI(unitId)
      : await fetchContent(identifier, { mode: null });
  } catch {
    product = null;
  }

  // Both services resolve with an error object instead of throwing.
  const name = typeof product?.name === 'string' ? product.name : '';

  return buildMetadata({
    title: name,
    description: product?.description,
    image: product?.posterImage || product?.appIcon,
    ...options,
  });
}
