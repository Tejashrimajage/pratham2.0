// pages/content-details/[identifier].tsx

import React from 'react';
import Layout from '@learner/components/pos/Layout';
import dynamic from 'next/dynamic';
import { getMetadata } from '@learner/utils/API/metabaseService';
import { getContentTrail, childrenOf } from '@learner/utils/seo/contentData';
import { itemListJsonLd, breadcrumbJsonLd } from '@learner/utils/seo/jsonLd';
import JsonLd from '@learner/components/seo/JsonLd';

export async function generateMetadata({ params }: any) {
  return await getMetadata(params.courseId, params.unitId, {
    path: `/pos/content/${params.courseId}/${params.unitId}`,
  });
}

const CourseUnitDetails = dynamic(() => import('@CourseUnitDetails'), {
  ssr: false,
});
const App = async ({ params }: any) => {
  const { unit, crumbs, unitPath } = await getContentTrail({
    homePath: '/pos',
    homeName: 'Pratham Open School',
    coursePathBase: '/pos/content',
    courseId: params.courseId,
    unitId: params.unitId,
  });

  return (
    <Layout>
      {unit && (
        <JsonLd
          data={[
            itemListJsonLd(
              childrenOf(unit).map((item: any) => ({
                name: item.name,
                path: `${unitPath}/${item.identifier}`,
              }))
            ),
            breadcrumbJsonLd(crumbs),
          ]}
        />
      )}
      <CourseUnitDetails
        isShowLayout={false}
        _config={{
          isEnrollmentRequired: false,
          userIdLocalstorageName: 'did',
          contentBaseUrl: '/pos/content',
          default_img: '/images/image_ver.png',
          _card: { isHideProgress: true, isHideProgressStatus: true },
          _infoCard: {
            _cardMedia: { maxHeight: { xs: '200px', sm: '280px' } },
            default_img: '/images/image_ver.png',
          },
        }}
      />
    </Layout>
  );
};

export default App;
