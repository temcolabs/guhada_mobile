import React, { useState } from 'react';
import css from './ReviewSummary.module.scss';
import cn from 'classnames';
import StarItem from '../StarItem';

export default function ReviewSummary({
  reviewSummary = {
    averageReviewsRating: 0,
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
    totalReviewsCount: 0,
  },
  tabRefMap,
}) {
  const [fold, setFold] = useState(false);
  let summary = [
    { value: 'sizes', label: '사이즈', max: 0 },
    { value: 'colors', label: '컬러', max: 0 },
    { value: 'lengths', label: '길이감', max: 0 },
  ];

  if (reviewSummary.satisfactionSummary.sizes.length > 1) {
    for (let i = 0; i < summary.length; i++) {
      for (let j = 0; j < summary.length; j++) {
        summary[i].max = Math.max(
          summary[i].max,
          reviewSummary.satisfactionSummary[summary[i].value][j].count
        );
      }
    }
  }

  return (
    <div>
      <div className={css.wrap} ref={tabRefMap.reviewTab}>
        <div className={css.headerWrap}>
          <div className={css.header}>총 리뷰 평점</div>
          <div className={css.starWrap}>
            <div className={css.starItem}>
              {StarItem(reviewSummary.averageReviewsRating, true)}
            </div>
            <div className={css.averageReviewsRating}>{`${
              reviewSummary.averageReviewsRating
            }점`}</div>
          </div>
        </div>
        {reviewSummary.totalReviewsCount !== 0 && (
          <>
            <div>
              {summary.map((summary, index) => {
                return (
                  <div
                    className={cn(css.ratingWrap, { [css.fold]: !fold })}
                    key={index}
                  >
                    <div className={css.itemWrap}>
                      <div className={css.itemLabel}>{`${summary.label}`}</div>
                      <div className={css.valueWrap}>
                        {reviewSummary.satisfactionSummary[summary.value].map(
                          (data, dataIndex) => {
                            return fold ? (
                              <div
                                className={cn(css.valueItem, {
                                  [css.max]: summary.max === data.count,
                                })}
                                key={`${dataIndex}data`}
                              >
                                <div className={css.valueLabel}>
                                  {data.description}
                                </div>
                                <div className={css.valueGraph}>
                                  <div
                                    className={cn(css.bar, {
                                      [css.color]: summary.max === data.count,
                                    })}
                                    style={{
                                      width: `${(data.count /
                                        reviewSummary.totalReviewsCount) *
                                        100}%`,
                                    }}
                                  />
                                </div>
                                <div className={css.valueNumber}>
                                  {`${data.count}명`}
                                </div>
                              </div>
                            ) : (
                              <div
                                className={cn(
                                  css.valueItem,
                                  {
                                    [css.max]: summary.max === data.count,
                                  },
                                  {
                                    [css.foldItem]: summary.max !== data.count,
                                  }
                                )}
                                key={`${dataIndex}data`}
                              >
                                <div className={css.valueLabel}>
                                  {data.description}
                                </div>
                                <div className={css.valueGraph}>
                                  <div
                                    className={cn(css.bar, {
                                      [css.color]: summary.max === data.count,
                                    })}
                                    style={{
                                      width: `${(data.count /
                                        reviewSummary.totalReviewsCount) *
                                        100}%`,
                                    }}
                                  />
                                </div>
                                <div className={css.valueNumber}>
                                  {`${data.count}명`}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={cn(css.reviewBtn)} onClick={() => setFold(!fold)}>
              {fold ? (
                <>
                  {`열기`}
                  <img
                    src={'/static/icon/benefit_btn_minus.png'}
                    alt={'icon'}
                  />
                </>
              ) : (
                <>
                  {`자세히 보기`}
                  <img src={'/static/icon/benefit_btn_plus.png'} alt={'icon'} />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
