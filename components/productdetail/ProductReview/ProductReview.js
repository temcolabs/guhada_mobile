import React, { Component } from 'react';
import SectionWrap from '../SectionWrap';
import css from './ProductReview.module.scss';
import { inject, observer } from 'mobx-react';
import ReviewSummary from './ReviewSummary';
import ReviewTab from './ReviewTab';
import ProductReviewItems from './ProductReviewItems';
import _ from 'lodash';
import ProductReviewEmpty from './ProductReviewEmpty';
import { toJS } from 'mobx';
@inject('productreview', 'alert', 'login')
@observer
class ProductReview extends Component {
  render() {
    const { productreview, tabRefMap, alert, login } = this.props;
    const review = productreview.review;
    const reviewSummary = productreview.reviewSummary;

    let handleReviewIcon =
      review.totalPages === productreview.reviewPage + 1 ? true : false;
    return (
      <SectionWrap>
        <ReviewSummary reviewSummary={reviewSummary} tabRefMap={tabRefMap} />
        <ReviewTab
          totalElements={review.totalElements}
          setReviewTab={productreview.setReviewTab}
          setOrder={productreview.setOrder}
        />
        {!_.isNil(review.content) ? (
          <>
            <div className={css.reviewItemWrap}>
              {review.content.map((review, index) => {
                return (
                  <ProductReviewItems
                    review={review}
                    key={index}
                    productreview={productreview}
                    alert={alert}
                    login={login}
                  />
                );
              })}
            </div>
            {_.isNil(review.content) === false && handleReviewIcon === false && (
              <div className={css.reviewItemWrap}>
                <div
                  className={css.addReviewButton}
                  onClick={() => productreview.addReview()}
                >
                  상품 리뷰 더보기
                  <div className={css.plusIcon} />
                </div>
              </div>
            )}
          </>
        ) : (
          <ProductReviewEmpty alert={alert} productreview={productreview} />
        )}
      </SectionWrap>
    );
  }
}

export default ProductReview;
