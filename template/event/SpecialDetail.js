import React, { useState, useEffect } from 'react';
import { inject } from 'mobx-react';
import css from './SpecialDetail.module.scss';
import DefaultLayout from 'components/layout/DefaultLayout';
import Link from 'next/link';
import SectionItem from 'components/home/SectionItem';
import { LinkRoute } from 'childs/lib/router';
import Router from 'next/router';
import copy from 'copy-to-clipboard';
import DetailFilter from 'components/event/special/DetailFilter';
function SpecialDetail({ eventmain, alert }) {
  const [detail, setDetail] = useState({});
  let itemList = [];
  for (let i = 0; i < 20; i++) itemList.push('');
  useEffect(() => {
    setDetail(eventmain.eventDetail);
  }, [eventmain.eventDetail]);

  const copyUrlToClipboard = () => {
    const productUrl = `${window.location.protocol}//${window.location.host}${
      Router.router.asPath
    }`;

    copy(productUrl);

    alert.showAlert('상품 URL이 클립보드에 복사되었습니다.');
  };
  return (
    <DefaultLayout headerShape={'eventmain'} pageTitle={'기획전'}>
      <div className={css.wrap}>
        <div className={css.headerWrap}>
          <div className={css.titleWrap}>
            <div className={css.title}>겨울 특가 아우터 기획전</div>
            <div
              className={css.share}
              onClick={() => {
                copyUrlToClipboard();
              }}
            />
          </div>
          <div className={css.date}>2019. 05. 01 ~ 2019. 05. 31</div>
        </div>

        <div className={css.eventMainWrap} />

        <div className={css.specialItemList}>
          <div className={css.itemTitle}>기획전 ITEM</div>

          <div className={css.dashBoard}>
            <div className={css.totalCount}>총 {123}개</div>
            <div className={css.orderWrap}>
              <div className={css.order}>
                <DetailFilter />
              </div>
            </div>
          </div>

          <div className={css.itemWrap}>
            {itemList.map(() => {
              return (
                <LinkRoute
                // href={`/productdetail?deals=${item.dealId}`}
                // key={item.dealId}
                >
                  <a>
                    <SectionItem />
                  </a>
                </LinkRoute>
              );
            })}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default inject('eventmain', 'alert')(SpecialDetail);
