import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';
import { getLayoutInfo } from 'stores/LayoutStore';
import API from 'childs/lib/API';
import isServer from 'childs/lib/common/isServer';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Layout from 'components/layout/Layout';
import SpecialDetail from 'template/event/SpecialDetail';
import MountLoading from 'components/atoms/Misc/MountLoading';

function SpecialDetailPage() {
  /**
   * states
   */
  const { newSpecial: newSpecialStore } = useStores();
  const headData = newSpecialStore.headData;
  const router = useRouter();

  /**
   * side effects
   */
  useEffect(() => {
    if (newSpecialStore.isInitial) {
      window.scrollTo(0, 0);
    }
    const eventId = router.query.id;
    newSpecialStore.fetchSpecialDetail(eventId);
  }, []);

  /**
   * render
   */
  return (
    <>
      <HeadForSEO
        pageName={headData.pageName || '기획전'}
        description={headData.description}
        image={headData.image}
      />
      <Layout title={'기획전'}>
        {(newSpecialStore.isInitial || newSpecialStore.isLoading) && (
          <MountLoading gutter />
        )}
        <SpecialDetail />
      </Layout>
    </>
  );
}

SpecialDetailPage.getInitialProps = async function({ req, pathname, query }) {
  if (isServer) {
    try {
      const eventId = query.id || req.query.id;
      if (!eventId) {
        throw new Error('Invalid request - eventId not found');
      }

      const { data } = await API.settle.get(
        `/plan/list/detail?eventId=${eventId}`
      );

      const specialDetail = data.data;

      const { type, headerFlags } = getLayoutInfo({
        pathname,
        query,
      });

      return {
        initialState: {
          newSpecial: {
            eventId,
            specialDetail,
          },
          layout: {
            type,
            headerFlags,
          },
        },
      };
    } catch (error) {
      console.error(error.message);
      return {};
    }
  }
  return {};
};

export default observer(SpecialDetailPage);
