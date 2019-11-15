import React, { useState, useEffect } from 'react';
import { inject } from 'mobx-react';
import css from './EventMain.module.scss';
import DefaultLayout from 'components/layout/DefaultLayout';
import ListItem from 'components/event/eventmain/ListItem';
import Filter from 'components/event/eventmain/Filter';

function EventMain({ eventmain }) {
  const [list, setList] = useState([]);
  useEffect(() => {
    setList([...eventmain.eventList]);
  }, [eventmain]);
  return (
    <DefaultLayout headerShape={'eventmain'} pageTitle={'이벤트'}>
      <div className={css.wrap}>
        <div className={css.dashBoard}>
          <div className={css.totalCount}>총 {list.length}개</div>
          <div className={css.filter}>
            <Filter
              onChange={value => {
                eventmain.getEventList(value);
              }}
            />
          </div>
        </div>

        <div className={css.eventListWrap}>
          {list.map((data, index) => {
            return <ListItem key={index} data={data} />;
          })}
        </div>

        {true ? null : (
          <div className={css.moreButton}>
            더 보기
            <i />
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

export default inject('eventmain')(EventMain);
