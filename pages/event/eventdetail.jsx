import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';
import { getLayoutInfo } from 'stores/LayoutStore';
import API from 'childs/lib/API';
import isServer from 'childs/lib/common/isServer';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
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
      {(newEventStore.isInitial || newEventStore.isLoading) && (
        <MountLoading gutter />
      )}
      <EventDetail />
    </>
  );
}

EventDetailPage.getInitialProps = async function({ req, pathname, query }) {
  const initialProps = { layout: { title: '이벤트' } };

  if (isServer) {
    const { type, headerFlags } = getLayoutInfo({ pathname, query });

    initialProps.initialState = {
      layout: { type, headerFlags },
    };

    try {
      const eventId = query.id || req.query.id;
      if (!eventId) {
        throw new Error('Invalid requet - eventId not found');
      }

      const { data } = await API.settle.get(
        `/event/list/detail?eventId=${eventId}`
      );

      const eventDetail = data.data;

      initialProps.initialState.eventmain = { eventId, eventDetail };
    } catch (error) {
      console.error(error.message);
    }
  }

  return initialProps;
};

export default observer(EventDetailPage);
