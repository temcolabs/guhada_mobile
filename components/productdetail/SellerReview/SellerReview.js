import { Component } from 'react';
import SectionWrap from '../SectionWrap';
import css from './SellerReview.module.scss';
import { inject, observer } from 'mobx-react';
import SellerTab from './SellerTab';
import SellerReviewItems from './SellerReviewItems';
import _ from 'lodash';
import SellerReviewEmpty from './SellerReviewEmpty';

@inject('sellerReview', 'alert', 'login')
@observer
class SellerReview extends Component {
  render() {
    const { sellerReview, alert, login } = this.props;
    const review = sellerReview.review;

    let handleReviewIcon =
      review.totalPages === sellerReview.reviewPage + 1 ? true : false;
    return (
      <SectionWrap>
        <SellerTab
          totalElements={review.totalElements}
          setReviewTab={sellerReview.setReviewTab}
          setOrder={sellerReview.setOrder}
        />
        {!_.isNil(review.content) ? (
          <>
            <div className={css.reviewItemWrap}>
              {review.content.map((review, index) => {
                return (
                  <SellerReviewItems
                    review={review}
                    key={index}
                    sellerReview={sellerReview}
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
                  onClick={() => sellerReview.addReview()}
                >
                  상품 리뷰 더보기
                  <div className={css.plusIcon} />
                </div>
              </div>
            )}
          </>
        ) : (
          <SellerReviewEmpty alert={alert} sellerReview={sellerReview} />
        )}
      </SectionWrap>
    );
  }
}

export default SellerReview;
