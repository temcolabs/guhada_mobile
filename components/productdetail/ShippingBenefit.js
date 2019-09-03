import React, { Component } from 'react';
import css from './ShippingBenefit.module.scss';
import StarItem from './StarItem';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';

@inject('productreview')
@observer
class ShippingBenefit extends Component {
  render() {
    const {
      deals,
      satisfaction,
      seller,
      productreview,
      shipExpenseType,
    } = this.props;
    const reviewSummary = productreview.reviewSummary;
    console.log('reviewSummary', productreview.reviewSummary);
    return (
      <div className={css.wrap}>
        <div className={css.itemWrap}>
          <div className={css.itemTitle}>배송정보</div>
          <div className={css.contentsWrap}>
            <div>{shipExpenseType}</div>
          </div>
        </div>
        <div className={css.itemWrap}>
          <div className={css.itemTitle}>혜택정보</div>
          <div className={css.contentsWrap}>
            <div>포인트 적립</div>
            <div>무이자 할부</div>
            <div>카드추가혜택</div>
            <div className={css.plusIcon} />
          </div>
        </div>
        <div className={css.sellerWrap}>
          <div
            className={css.profile}
            style={
              _.isNil(seller) !== true && seller.user.profileImageUrl !== ''
                ? {
                    backgroundImage: `url(${seller.user.profileImageUrl})`,
                  }
                : null
            }
          />
          <div>
            <div>
              <div className={css.infoTop}>
                <div className={css.sellerName}>{deals.sellerName}</div>
                <div>
                  <div className={css.levelWrap}>
                    <div>1</div>
                  </div>
                  <div className={css.sellerGrade}>*파워셀러</div>
                </div>
              </div>
              <div className={css.infoWrap}>
                <div>
                  <button className={css.colored}>팔로우</button>
                </div>
                <div>
                  <button>셀러스토어</button>
                </div>
              </div>
            </div>
            <div className={css.satisfaction}>
              <div className={css.good}>
                만족 {satisfaction ? satisfaction.good : null}명
              </div>
              <div className={css.usual}>
                보통 {satisfaction ? satisfaction.normal : null}명
              </div>
              <div className={css.bad}>
                불만족 {satisfaction ? satisfaction.bad : null}명
              </div>
            </div>
          </div>
        </div>
        <div className={css.itemWrap}>
          <div className={css.itemTitle}>상품리뷰</div>
          <div className={css.contentsWrap}>
            <div className={css.itemContents}>
              {_.isNil(reviewSummary) === false
                ? StarItem(reviewSummary.averageReviewsRating, true)
                : StarItem(0, true)}
            </div>
            <div className={css.itemContents}>
              {`${
                _.isNil(reviewSummary) === false
                  ? reviewSummary.totalReviewsCount
                  : 0
              }건`}
              <div className={css.arrowR} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShippingBenefit;
