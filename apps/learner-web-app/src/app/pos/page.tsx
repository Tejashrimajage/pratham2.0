// pages/content-details/[identifier].tsx

import React from 'react';
import dynamic from 'next/dynamic';
import { buildMetadata } from '@learner/utils/seo/buildMetadata';

export const metadata = buildMetadata({
  title: 'Pratham Open School — Free Learning Videos, Games & Stories',
  description: `Pratham Open School offers free, downloadable videos, games, reading material and stories in 15 languages for ages 1 to 18+, designed to support self-led learning and group learning through activities and projects.`,
  image: '/images/home-page-banner.png',
  path: '/pos',
});

const Home = dynamic(() => import('@learner/components/pos/Home'), {
  ssr: false,
});
const App = () => {
  return (
    <>
      <Home />
    </>
  );
};

export default App;
