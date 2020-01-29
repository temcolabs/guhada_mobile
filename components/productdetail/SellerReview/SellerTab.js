import React, { useState } from 'react';
import css from './SellerTab.module.scss';
import cn from 'classnames';
import SellerOrder from './SellerOrder';
import SellerRating from './SellerRating';
import _ from 'lodash';
import { inject } from 'mobx-react';
function SellerTab({
  setReviewTab = () => {},
  setOrder,
  totalElements,
  sellerReview,
}) {
  const [isOrderVisible, setIsOrderVisible] = useState(false);
  const [isRatingVisible, setIsRatingVisible] = useState(false);
  const [orderLabel, setOrderLabel] = useState('최신 순');

  const ratingList = [
    { label: '전체 평점', value: '' },
    { label: '5점 만', value: 'FIVE' },
    { label: '4점 만', value: 'FOUR' },
    { label: '3점 만', value: 'THREE' },
    { label: '2점 만', value: 'TWO' },
    { label: '1점 만', value: 'ONE' },
  ];
  let rating = ratingList.find(rating => rating.value === sellerReview.rating);
  return (
    <div className={css.wrap}>
      <div className={css.tabHeader}>
        <div>{`셀러 리뷰 ${_.isNil(totalElements) ? 0 : totalElements}건`}</div>
        <div className={css.orderWrap}>
          <div
            className={css.orderItem}
            onClick={() => setIsOrderVisible(true)}
          >
            <div>{orderLabel}</div>
            <img
              className={css.icon}
              src={'/static/icon/arrow_down_line.png'}
              alt={'icon'}
            />
          </div>
          <div
            className={css.orderItem}
            onClick={() => setIsRatingVisible(true)}
          >
            <div>{rating.label}</div>
            <img
              className={css.icon}
              src={'/static/icon/arrow_down_line.png'}
              alt={'icon'}
            />
          </div>
        </div>
      </div>
      <div className={css.tabWrap}>
        <div
          className={cn(css.tabItem, {
            [css.selected]: sellerReview.reviewTab === 'all',
          })}
          onClick={() => {
            setReviewTab('all');
          }}
        >
          <div className={css.betweenTab}>전체리뷰</div>
        </div>
        <div
          className={cn(css.tabItem, {
            [css.selected]: sellerReview.reviewTab === 'photo',
          })}
          onClick={() => {
            setReviewTab('photo');
          }}
        >
          <div className={css.betweenTab}>포토리뷰</div>
        </div>
        <div
          className={cn(css.tabItem, {
            [css.selected]: sellerReview.reviewTab === 'personal',
          })}
          onClick={() => {
            setReviewTab('personal');
          }}
        >
          <div className={css.betweenTab}>수치포함</div>
        </div>
        {/* <div
          className={cn(css.tabItem, {
            [css.selected]: sellerReview.reviewTab === 'reply',
          })}
          onClick={() => {
            setReviewTab('reply');
          }}
        >
          댓글포함
        </div> */}
      </div>
      <SellerOrder
        isVisible={isOrderVisible}
        onClose={() => setIsOrderVisible(false)}
        setOrder={setOrder}
        setOrderLabel={setOrderLabel}
      />
      <SellerRating
        isVisible={isRatingVisible}
        onClose={() => setIsRatingVisible(false)}
        ratingList={ratingList}
      />
    </div>
  );
}
export default inject('sellerReview')(SellerTab);
