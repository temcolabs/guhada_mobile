import css from './EventDetail.module.scss';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import Link from 'next/link';
function EventDetail() {
  /**
   * states
   */
  const { eventmain: eventmainStore, newEvent: newEventStore } = useStores();

  /**
   * render
   */
  return (
    <div className={css.wrap}>
      {newEventStore.eventDetail.detailPage ? (
        <Link href={newEventStore.eventDetail.detailPageLink}>
          <div className={css.detailContent}>
            <img
              src={newEventStore.eventDetail.imgDetailUrlM}
              onClick={() => {
                eventmainStore.sendNative('join', '');
              }}
              alt="상세이미지"
            />
          </div>
        </Link>
      ) : (
        <div className={css.detailContent}>
          <img src={newEventStore.eventDetail.imgDetailUrlM} alt="상세이미지" />
        </div>
      )}
    </div>
  );
}

export default observer(EventDetail);
