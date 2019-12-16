import React, { useState, useEffect, Fragment } from 'react';
import css from './ListItem.module.scss';
import Link from 'next/link';
import moment from 'moment';

function ListItem({ data }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    data.eventStartDate
      ? setStartDate(moment(data.eventStartDate).format('YYYY. MM. DD'))
      : setStartDate(null);

    data.eventEndDate
      ? setEndDate(moment(data.eventEndDate).format('YYYY. MM. DD'))
      : setEndDate(null);
  }, [data]);
  return (
    <div className={css.eventItem}>
      <Link
        href={data.detailPageUrl ? data.detailPageUrl : data.detailPageLink}
      >
        <div
          className={
            data.detailPageUrl || data.detailPageLink ? css.detailTrue : null
          }
        >
          <div
            className={css.bannerImage}
            style={{
              backgroundImage: `url(${data.imgUrlM})`,
            }}
          />

          <div className={css.eventTitle}>{data.eventTitle}</div>
          <div className={css.eventDate}>{`${startDate ? startDate : ''} ~ ${
            endDate ? endDate : ''
          }`}</div>
        </div>
      </Link>
    </div>
  );
}

export default ListItem;
