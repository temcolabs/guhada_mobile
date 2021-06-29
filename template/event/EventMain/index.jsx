import css from './EventMain.module.scss';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import ListItem from 'components/event/eventmain/ListItem';
import Filter from 'components/event/eventmain/Filter';

function EventMain() {
  /**
   * states
   */
  const { eventmain: eventmainStore } = useStores();

  /**
   * render
   */
  return (
    <div className={css.wrap}>
      <div className={css.dashBoard}>
        <div className={css.totalCount}>
          총 {eventmainStore.eventList.length}개
        </div>
        <div className={css.filter}>
          <Filter
            onChange={(value) => {
              eventmainStore.getEventList(value);
            }}
          />
        </div>
      </div>

      {eventmainStore.eventList?.length > 0 && (
        <div className={css.eventListWrap}>
          {eventmainStore.eventList.map((data, index) => {
            return <ListItem key={index} data={data} />;
          })}
        </div>
      )}
    </div>
  );
}

export default observer(EventMain);
