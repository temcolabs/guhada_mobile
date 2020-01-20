import React, { useState } from 'react';
import css from './SellerTab.module.scss';
import cn from 'classnames';
import SellerOrder from './SellerOrder';
import SellerRating from './SellerRating';
import _ from 'lodash';

export default function SellerTab({
  setReviewTab = () => {},
  setOrder,
  totalElements,
}) {
  const [reviewTabText, setReviewTabText] = useState('all');
  const [isOrderVisible, setIsOrderVisible] = useState(false);
  const [isRatingVisible, setIsRatingVisible] = useState(false);
  const [orderLabel, setOrderLabel] = useState('최신 순');
  const [ratingLabel, setRatingLabel] = useState('전체평점');
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
            <div>{ratingLabel}</div>
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
            [css.selected]: reviewTabText === 'all',
          })}
          onClick={() => {
            setReviewTabText('all');
            setReviewTab('all');
          }}
        >
          <div className={css.betweenTab}>전체리뷰</div>
        </div>
        <div
          className={cn(css.tabItem, {
            [css.selected]: reviewTabText === 'photo',
          })}
          onClick={() => {
            setReviewTabText('photo');
            setReviewTab('photo');
          }}
        >
          <div className={css.betweenTab}>포토리뷰</div>
        </div>
        <div
          className={cn(css.tabItem, {
            [css.selected]: reviewTabText === 'personal',
          })}
          onClick={() => {
            setReviewTabText('personal');
            setReviewTab('personal');
          }}
        >
          <div className={css.betweenTab}>수치포함</div>
        </div>
        {/* <div
          className={cn(css.tabItem, {
            [css.selected]: reviewTabText === 'reply',
          })}
          onClick={() => {
            setReviewTabText('reply');
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
        setRatingLabel={setRatingLabel}
      />
    </div>
  );
}
