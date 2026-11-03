import React from 'react';

import List from '@learner/components/themantic/content/List';
import ContentDetailsPage from '@learner/components/themantic/content/enrollment-details';
import { getMetadata } from '@learner/utils/API/metabaseService';

export async function generateMetadata({ params }: any) {
  return await getMetadata(params.identifier, undefined, {
    path: `/themantic/content-details/${params.identifier}`,
    type: 'article',
  });
}

const page = () => {
  return (
    <div className="thematic-page">
      <ContentDetailsPage />
    </div>
  );
};

export default page;
