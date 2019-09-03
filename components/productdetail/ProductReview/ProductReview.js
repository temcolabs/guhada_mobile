import React, { Component } from 'react';
import SectionWrap from '../SectionWrap';
import css from './ProductReview.module.scss';
import { inject, observer } from 'mobx-react';
import ReviewSummary from './ReviewSummary';
import ReviewTab from './ReviewTab';
import ProductReviewItems from './ProductReviewItems';
import _ from 'lodash';
import ProductReviewEmpty from './ProductReviewEmpty';
@inject('productreview')
@observer
class ProductReview extends Component {
  render() {
    const { productreview } = this.props;
    const review = productreview.review;
    const reviewSummary = productreview.reviewSummary;

    return (
      <SectionWrap>
        <ReviewSummary reviewSummary={reviewSummary} />
        <ReviewTab
          totalElements={review.totalElements}
          setReviewTab={productreview.setReviewTab}
          setOrder={productreview.setOrder}
        />
        {!_.isNil(review.content) ? (
          <>
            <div className={css.reviewItemWrap}>
              {review.content.map((review, index) => {
                return <ProductReviewItems review={review} key={index} />;
              })}
            </div>
            <div className={css.reviewItemWrap}>
              <div
                className={css.addReviewButton}
                onClick={() => productreview.addReview()}
              >
                상품 리뷰 더보기 +
              </div>
            </div>
          </>
        ) : (
          <ProductReviewEmpty />
        )}
      </SectionWrap>
    );
  }
}

export default ProductReview;
