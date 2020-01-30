import React from 'react';
import BestReviewItem from './BestReviewItem';
import css from './BestReview.module.scss';
import { inject } from 'mobx-react';
function BestReview({ main }) {
  const bestReview = main.bestReview;

  return (
    <div className={css.wrap}>
      {bestReview.map((review, index) => {
        return <BestReviewItem item={review} key={index} />;
      })}
    </div>
  );
}
export default inject('main')(BestReview);
