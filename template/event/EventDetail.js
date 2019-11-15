import React, { useState, useEffect } from 'react';
import { inject } from 'mobx-react';
import css from './EventDetail.module.scss';
import DefaultLayout from 'components/layout/DefaultLayout';
import Link from 'next/link';
function EventDetail({ eventmain }) {
  const [detail, setDetail] = useState({});
  useEffect(() => {
    setDetail(eventmain.eventDetail);
  }, [eventmain.eventDetail]);

  return (
    <DefaultLayout headerShape={'eventmain'} pageTitle={'이벤트'}>
      <div className={css.wrap}>
        {detail.detailPage ? (
          <Link href={detail.detailPageLink}>
            <div className={css.detailContent}>
              <img src={detail.imgDetailUrlM} alt="상세이미지" />
            </div>
          </Link>
        ) : (
          <div className={css.detailContent}>
            <img src={detail.imgDetailUrlM} alt="상세이미지" />
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

export default inject('eventmain')(EventDetail);
