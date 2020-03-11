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
import { useObserver } from 'mobx-react-lite';

import moment from 'moment';
function SpecialDetail({ special, alert }) {
  const copyUrlToClipboard = () => {
    const productUrl = `${window.location.protocol}//${window.location.host}${
      Router.router.asPath
    }`;

    copy(productUrl);

    alert.showAlert('상품 URL이 클립보드에 복사되었습니다.');
  };

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    special.specialDetail.startDate
      ? setStartDate(
          moment(special.specialDetail.startDate).format('YYYY. MM. DD')
        )
      : setStartDate(null);

    special.specialDetail.endDate
      ? setEndDate(moment(special.specialDetail.endDate).format('YYYY. MM. DD'))
      : setEndDate(null);
  }, [special.specialDetail]);

  // const categoryList = [
  //   { label: '가방', tab: true },
  //   { label: '지갑', tab: false },
  //   { label: '니트', tab: false },
  // ];

  // const categoryTabHandler = index => {
  //   for (let i = 0; i < categoryList.length; i++) {
  //     categoryList[i].tab = false;
  //     if (categoryList[i] === index) {
  //       categoryList[i].tab = true;
  //     }
  //   }
  // };

  return useObserver(() => (
    <DefaultLayout headerShape={'eventmain'} pageTitle={'기획전'}>
      <div className={css.wrap}>
        <div className={css.headerWrap}>
          <div className={css.titleWrap}>
            <div className={css.title}>{special.specialDetail.detailTitle}</div>
            <div
              className={css.share}
              onClick={() => {
                copyUrlToClipboard();
              }}
            />
          </div>
          <div className={css.date}>{`${startDate ? startDate : ''} ~ ${
            endDate ? endDate : ''
          }`}</div>
        </div>

        <div className={css.eventMainWrap}>
          <img src={`${special.specialDetail.mobileImageUrl}`} alt="" />
        </div>
        {/* <div className={css.category}>
          {categoryList.map((special.specialDetail, index) => {
            return (
              <div
                className={[css.categoryItem, special.specialDetail.tab ? css.tabOn : null].join(
                  ' '
                )}
                onClick={() => {
                  categoryTabHandler(index);
                }}
                key={index}
              >
                {special.specialDetail.label}
              </div>
            );
          })}
        </div> */}
        <div className={css.specialItemList}>
          <div className={css.itemTitle}>기획전 ITEM</div>

          <div className={css.dashBoard}>
            <div className={css.totalCount}>
              총
              {special.totalItemCount !== undefined
                ? Number(special.totalItemCount)
                : 0}
              개
            </div>
            <div className={css.orderWrap}>
              <div className={css.order}>
                <DetailFilter />
              </div>
            </div>
          </div>

          <div className={css.itemWrap}>
            {special.specialDetailList?.map((data, index) => {
              return (
                <LinkRoute
                  href={`/productdetail?deals=${data.dealId}`}
                  key={index}
                >
                  <a>
                    <SectionItem item={data} />
                  </a>
                </LinkRoute>
              );
            })}
          </div>
        </div>
      </div>
    </DefaultLayout>
  ));
}

export default inject('special', 'alert')(SpecialDetail);
