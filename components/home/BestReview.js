import css from './BestReview.module.scss';
import { memo } from 'react';
import PropTypes from 'prop-types';
import BestReviewItem from './BestReviewItem';

const BestReview = ({ reviewList }) => (
  <div className={css.wrap}>
    {reviewList.map((review) => (
      <BestReviewItem item={review} key={review.id} />
    ))}
  </div>
);

BestReview.propTypes = {
  reviewList: PropTypes.any,
};

export default memo(BestReview);
