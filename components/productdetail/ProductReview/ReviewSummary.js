import React, { useState } from 'react';
import css from './ReviewSummary.module.scss';
import cn from 'classnames';
import StarItem from '../StarItem';
import _ from 'lodash';

export default function ReviewSummary({
  review,
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

  if (_.isNil(reviewSummary) === false)
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
  const reviewSummaryNil = _.isNil(reviewSummary);

  return (
    <div>
      <div className={css.wrap} ref={tabRefMap.reviewTab}>
        <div className={css.headerWrap}>
          <div className={css.header}>총 리뷰 평점</div>
          <div className={css.starWrap}>
            <div className={css.starItem}>
              {reviewSummaryNil === false
                ? StarItem(reviewSummary.averageReviewsRating, true)
                : StarItem(0, true)}
            </div>
            <div className={css.averageReviewsRating}>
              {reviewSummaryNil === false
                ? `${reviewSummary.averageReviewsRating}점`
                : `0점`}
            </div>
          </div>
        </div>
        {reviewSummaryNil === false && (
          <>
            <div>
              {summary.map((summary, index) => {
                return (
                  <div
                    className={cn(css.ratingWrap, { [css.fold]: !fold })}
                    key={index}
                  >
                    <div className={css.itemWrap}>
                      <div className={css.itemLabel}>
                        {(review?.content &&
                          review.content[0].reviewQuestions[index].type) ||
                          summary.label}
                      </div>
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
                                  {review?.content &&
                                    review.content[0].reviewQuestions[index]
                                      .answerList[dataIndex].answer}
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
                                  {(data.reviewQuestion &&
                                    data.reviewQuestion.answerList[dataIndex] &&
                                    data.reviewQuestion.answerList[dataIndex]
                                      .answer) ||
                                    data.description}
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
                  {`닫기`}
                  <img src={'/static/icon/minors_icon.png'} alt={'icon'} />
                </>
              ) : (
                <>
                  {`자세히 보기`}
                  <img
                    src={'/static/icon/detail_btn_more_open.png'}
                    alt={'icon'}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
