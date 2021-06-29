import { useState, useEffect } from 'react';
import css from './ListItem.module.scss';
import moment from 'moment';
import { pushRoute } from 'childs/lib/router';

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
      <div
        className={
          (data.detailPageUrl || data.detailPageLink) && css.detailTrue
        }
        onClick={() => {
          pushRoute(`/event/special/${data.id}`);
        }}
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
    </div>
  );
}

export default ListItem;
