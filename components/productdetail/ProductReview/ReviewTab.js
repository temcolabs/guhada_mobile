import React, { useState } from 'react';
import css from './ReviewTab.module.scss';
import cn from 'classnames';
import ReviewOrder from './ReviewOrder';
import ReviewRating from './ReviewRating';
export default function ReviewTab({ setReviewTab = () => {}, setOrder }) {
  const [reviewTabText, setReviewTabText] = useState('all');
  const [isOrderVisible, setIsOrderVisible] = useState(false);
  const [isRatingVisible, setIsRatingVisible] = useState(false);
  const [orderLabel, setOrderLabel] = useState('최신 순');
  return (
    <div className={css.wrap}>
      <div className={css.tabHeader}>
        <div>{`리뷰 156건`}</div>
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
            <div>전체평점</div>
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
            setReviewTabText('all'), setReviewTab('all');
          }}
        >
          전체리뷰
        </div>
        <div
          className={cn(css.tabItem, {
            [css.selected]: reviewTabText === 'photo',
          })}
          onClick={() => {
            setReviewTabText('photo'), setReviewTab('photo');
          }}
        >
          포토리뷰
        </div>
        <div
          className={cn(css.tabItem, {
            [css.selected]: reviewTabText === 'personal',
          })}
          onClick={() => {
            setReviewTabText('personal'), setReviewTab('personal');
          }}
        >
          수치포함
        </div>
        <div
          className={cn(css.tabItem, {
            [css.selected]: reviewTabText === 'reply',
          })}
          onClick={() => {
            setReviewTabText('reply'), setReviewTab('reply');
          }}
        >
          댓글포함
        </div>
      </div>
      <ReviewOrder
        isVisible={isOrderVisible}
        onClose={() => setIsOrderVisible(false)}
        setOrder={setOrder}
        setOrderLabel={setOrderLabel}
      />
      <ReviewRating
        isVisible={isRatingVisible}
        onClose={() => setIsRatingVisible(false)}
      />
    </div>
  );
}
