import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';
import { getLayoutInfo } from 'stores/LayoutStore';
import API from 'lib/API';
import isServer from 'lib/common/isServer';
import HeadForSEO from 'lib/components/HeadForSEO';
import SpecialDetail from 'template/event/SpecialDetail';
import MountLoading from 'components/atoms/Misc/MountLoading';

function SpecialDetailPage({ initialHeadData }) {
  /**
   * states
   */
  const { newSpecial: newSpecialStore } = useStores();
  const headData = initialHeadData || newSpecialStore.headData;
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
      {(newSpecialStore.isInitial || newSpecialStore.isLoading) && (
        <MountLoading gutter />
      )}
      <SpecialDetail />
    </>
  );
}

SpecialDetailPage.getInitialProps = async function({ req, pathname, query }) {
  const initialProps = { layout: { title: '이벤트', scrollMemo: true } };

  if (isServer) {
    const { type, headerFlags } = getLayoutInfo({ pathname, query });

    initialProps.initialState = {
      layout: { type, headerFlags },
    };

    try {
      const eventId = query.id || req.query.id;
      if (!eventId) {
        throw new Error('Invalid request - eventId not found');
      }

      const { data } = await API.settle.get(
        `/plan/list/detail?eventId=${eventId}`
      );

      const specialDetail = data.data;

      initialProps.initialState.newSpecial = { eventId, specialDetail };
    } catch (error) {
      console.error(error.message);
    }
  }

  return initialProps;
};

export default observer(SpecialDetailPage);
