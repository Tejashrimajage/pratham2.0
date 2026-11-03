import React from 'react';

import List from '@learner/components/themantic/content/List';
import ContentDetailsPage from '@learner/components/themantic/content/enrollment-details';
import { getMetadata } from '@learner/utils/API/metabaseService';
import { getContent } from '@learner/utils/seo/contentData';
import { contentJsonLd, breadcrumbJsonLd } from '@learner/utils/seo/jsonLd';
import JsonLd from '@learner/components/seo/JsonLd';

export async function generateMetadata({ params }: any) {
  return await getMetadata(params.identifier, undefined, {
    path: `/themantic/content-details/${params.identifier}`,
    type: 'article',
  });
}

const page = async ({ params }: any) => {
  const content = await getContent(params?.identifier);
  const path = `/themantic/content-details/${params?.identifier}`;

  return (
    <div className="thematic-page">
      {content && (
        <JsonLd
          data={[
            contentJsonLd({
              name: content.name,
              description: content.description,
              path,
              image: content.posterImage || content.appIcon,
              mimeType: content.mimeType,
              language: content.contentLanguage,
              contentUrl: content.artifactUrl,
            }),
            breadcrumbJsonLd([
              { name: 'Experimento India', path: '/themantic' },
              { name: content.name, path },
            ]),
          ]}
        />
      )}
      <ContentDetailsPage />
    </div>
  );
};

export default page;
