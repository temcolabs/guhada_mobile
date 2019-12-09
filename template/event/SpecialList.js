import React, { useState, useEffect } from 'react';
import { inject } from 'mobx-react';
import css from './SpecialList.module.scss';
import DefaultLayout from 'components/layout/DefaultLayout';
import ListItem from 'components/event/special/ListItem';
import Filter from 'components/event/special/Filter';
import { useObserver } from 'mobx-react-lite';

function SpecialList({ eventmain }) {
  return useObserver(() => (
    <DefaultLayout headerShape={'eventmain'} pageTitle={'기획전'}>
      <div className={css.wrap}>
        <div className={css.dashBoard}>
          <div className={css.totalCount}>
            총 {eventmain.eventList.length}개
          </div>
          <div className={css.filter}>
            <Filter
              onChange={value => {
                eventmain.getEventList(value);
              }}
            />
          </div>
        </div>

        {eventmain?.eventList?.length > 0 ? (
          <div className={css.eventListWrap}>
            {eventmain?.eventList?.map((data, index) => {
              return <ListItem key={index} data={data} />;
            })}
          </div>
        ) : null}

        {true ? null : (
          <div className={css.moreButton}>
            더 보기
            <i />
          </div>
        )}
      </div>
    </DefaultLayout>
  ));
}

export default inject('eventmain')(SpecialList);
