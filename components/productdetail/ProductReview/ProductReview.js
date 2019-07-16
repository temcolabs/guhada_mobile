import React, { Component } from 'react';
import SectionWrap from '../SectionWrap';
import css from './ProductReview.module.scss';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import ReviewSummary from './ReviewSummary';
import ReviewTab from './ReviewTab';
import ProductReviewItems from './ProductReviewItems';
import _ from 'lodash';
import ProductReviewEmpty from './ProductReviewEmpty';
@inject('productreview')
@observer
class ProductReview extends Component {
  render() {
    let { productreview } = this.props;
    let review = productreview.review;
    let reviewSummary = productreview.reviewSummary;

    return (
      <SectionWrap>
        <ReviewSummary reviewSummary={reviewSummary} />
        <ReviewTab
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
