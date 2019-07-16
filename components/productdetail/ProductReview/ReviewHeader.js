import React from 'react';
import css from './ReviewHeader.module.scss';
import StarItem from '../StarItem';

export default function ReviewHeader({
  reviewSummary = {
    averageReviewsRating: 1.4,
    satisfactionSummary: {
      colors: [
        {
          count: 1,
          description: 'Too bright',
          name: 'BRIGHTER',
        },
      ],
      lengths: [
        {
          count: 1,
          description: 'Too bright',
          name: 'BRIGHTER',
        },
      ],
      sizes: [
        {
          count: 1,
          description: 'Too bright',
          name: 'BRIGHTER',
        },
      ],
    },
    totalReviewsCount: 7,
  },
}) {
  let summary = [
    { value: 'sizes', label: '사이즈' },
    { value: 'colors', label: '컬러' },
    { value: 'lengths', label: '길이감' },
  ];
  return (
    <div>
      <div className={css.wrap}>
        <div className={css.headerWrap}>
          <div className={css.header}>총 리뷰 평점</div>
          <div className={css.starWrap}>
            <div>{StarItem()}</div>
            <div>{`4.4점`}</div>
          </div>
        </div>
        {summary.map(summary => {
          return (
            <div className={css.ratingWrap}>
              <div className={css.itemWrap}>
                <div className={css.itemLabel}>{`${summary.label}`}</div>
                <div className={css.valueWrap}>
                  {/* {reviewSummary.satisfactionSummary.summary[value].} */}
                  {summary.value}
                  <div className={css.valueItem}>
                    <div className={css.valueLabel}>{`생각보다 커요`}</div>
                    <div className={css.valueGraph}>
                      <div className={css.bar} style={{ width: '10%' }} />
                    </div>
                    <div className={css.valueNumber}>{`99명`}</div>
                  </div>
                  <div className={css.valueItem}>
                    <div className={css.valueLabel}>{`작아요`}</div>
                    <div className={css.valueGraph} />
                    <div className={css.valueNumber}>{`99명`}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
