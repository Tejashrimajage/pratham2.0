import React, { Suspense } from 'react';

import List from '@learner/components/themantic/content/List';
import { buildMetadata } from '@learner/utils/seo/buildMetadata';

export const metadata = buildMetadata({
  title: 'Experimento India — Science Courses & Experiments for Schools',
  description:
    'Hands-on science courses and experiments on energy, environment and health for schools, free from Experimento India.',
  path: '/themantic',
});

const Page = () => {
  return (
    <div className="thematic-page">
      <Suspense fallback={<div>Loading...</div>}>
        <List />
      </Suspense>
    </div>
  );
};

export default Page;
