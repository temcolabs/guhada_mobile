import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';
import { getLayoutInfo } from 'stores/LayoutStore';
import API from 'childs/lib/API';
import isServer from 'childs/lib/common/isServer';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Layout from 'components/layout/Layout';
import EventDetail from 'template/event/EventDetail';
import MountLoading from 'components/atoms/Misc/MountLoading';

function EventDetailPage() {
  /**
   * states
   */
  const { newEvent: newEventStore } = useStores();
  const headData = newEventStore.headData;
  const router = useRouter();

  /**
   * side effects
   */
  useEffect(() => {
    if (newEventStore.isInitial) {
      window.scrollTo(0, 0);
    }
    const eventId = router.query.id;
    newEventStore.fetchEventDetail(eventId);
  }, []);

  /**
   * render
   */
  return (
    <>
      <HeadForSEO
        pageName={headData.pageName || '이벤트'}
        description={headData.description}
        image={headData.image}
      />
      <Layout title={'이벤트'}>
        {(newEventStore.isInitial || newEventStore.isLoading) && (
          <MountLoading gutter />
        )}
        <EventDetail />
      </Layout>
    </>
  );
}

EventDetailPage.getInitialProps = async function({ req, pathname, query }) {
  if (isServer) {
    try {
      const eventId = query.id || req.query.id;
      if (!eventId) {
        throw new Error('Invalid requet - eventId not found');
      }

      const { data } = await API.settle.get(
        `/event/list/detail?eventId=${eventId}`
      );

      const eventDetail = data.data;

      const { type, headerFlags } = getLayoutInfo({
        pathname,
        query,
      });

      return {
        initialState: {
          eventmain: {
            eventId,
            eventDetail,
          },
        },
        layout: {
          type,
          headerFlags,
        },
      };
    } catch (error) {
      console.error(error.message);
      return {};
    }
  }
  return {};
};

export default observer(EventDetailPage);
