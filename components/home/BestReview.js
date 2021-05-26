import React from 'react';
import BestReviewItem from './BestReviewItem';
import css from './BestReview.module.scss';
import { inject } from 'mobx-react';
function BestReview({ main }) {
  const navDealId = main.navDealId;
  const bestReview =
    navDealId === 0 ? main.bestReview.slice(0, 30) : main.bestReview;

  return (
    <div className={css.wrap}>
      {bestReview.map((review, index) => {
        return <BestReviewItem item={review} key={index} />;
      })}
    </div>
  );
}
export default inject('main')(BestReview);
