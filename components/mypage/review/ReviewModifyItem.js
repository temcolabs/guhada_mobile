import React from 'react';
import css from './ReviewModifyItem.module.scss';
import addCommaToNum from 'childs/lib/common/addCommaToNum';
import StarItem from './StarItem';
import moment from 'moment';
import { dateFormat } from 'childs/lib/constant';
import { toJS } from 'mobx';
import StarCount from './StarCount';
import { pushRoute } from 'childs/lib/router';
import cn from 'classnames';
import isTruthy from 'childs/lib/common/isTruthy';
export default function ReviewModifyItem({
  productReview = {
    // 내가 작성한 리뷰
    bookmarksUserIds: '',
    order: {
      brandName: '',
      dealId: 0,
      discountPrice: 0,
      expireDate: '',
      imageName: '',
      imageUrl: '',
      optionAttribute1: '',
      optionAttribute2: '',
      optionAttribute3: '',
      orderDate: '',
      orderPrice: 0,
      orderProdGroupId: 0,
      orderProdId: 0,
      originalPrice: 0,
      prodName: '',
      productId: 0,
      purchaseConfirm: true,
      purchaseId: 0,
      purchaseStatus: '',
      purchaseStatusText: '',
      quantity: 0,
      season: '',
      sellerId: 0,
      sellerName: '',
      shipCompleteDate: '',
      shipPrice: 0,
      statusMessage: '',
    },
    reviewPhotos: [],
    productOption: { color: '', size: 0 },
    review: {
      colorSatisfaction: '',
      createdAt: '',
      id: 0,
      lengthSatisfaction: '',
      bookmarkCount: 0,
      orderProductGroupId: 0,
      photoCount: 0,
      productId: 0,
      productRating: '',
      sizeSatisfaction: '',
      textReview: '',
      userId: 0,
      userNickname: '',
    },
    userSize: { height: 0, weight: 0, top: '', bottom: 0, shoe: 0 },
  },
  onClickReviewButton = () => {},
  onClickDeleteButton = () => {},
}) {
  const currencyUnit = '원';
  const eaUnit = '개';
  let productRating;

  switch (productReview.review.productRating) {
    case 'HALF':
      productRating = 0.5;
      break;
    case 'ONE':
      productRating = 1;
      break;
    case 'ONE_HALF':
      productRating = 1.5;
      break;
    case 'TWO':
      productRating = 2;
      break;
    case 'TWO_HALF':
      productRating = 2.5;
      break;
    case 'THREE':
      productRating = 3;
      break;
    case 'THREE_HALF':
      productRating = 3.5;
      break;
    case 'FOUR':
      productRating = 4;
      break;
    case 'FOUR_HALF':
      productRating = 4.5;
      break;
    case 'FIVE':
      productRating = 5;
      break;
    default:
      productRating = 0;
      break;
  }

  return (
    <div className={css.itemWrap}>
      <div className={css.reviewWrap}>
        <div
          className={css.productImageBox}
          style={{ backgroundImage: `url(${productReview.order?.imageUrl})` }}
          onClick={() =>
            pushRoute(`/productdetail?deals=${productReview.order?.dealId}`)
          }
        />
        <div className={css.productInfo}>
          <div className={css.brandName}>{productReview.order?.brandName}</div>
          <div className={css.prodName}>
            <span>
              {productReview.order?.season ? productReview.order?.season : ''}
            </span>
            <span>{` ` + productReview.order?.prodName}</span>
          </div>
          <div className={css.option}>
            {isTruthy(productReview.order?.optionAttribute1) && (
              <div className={css.optionItem}>
                {productReview.order?.optionAttribute1}
              </div>
            )}
            {isTruthy(productReview.order?.optionAttribute2) && (
              <div className={css.optionItem}>
                {productReview.order?.optionAttribute2}
              </div>
            )}

            {isTruthy(productReview.order?.optionAttribute3) && (
              <div className={css.optionItem}>
                {productReview.order?.optionAttribute3}
              </div>
            )}

            {isTruthy(productReview.order?.quantity) && (
              <div className={css.optionItem}>
                {productReview.order?.quantity}
                {eaUnit}
              </div>
            )}
          </div>
          <div className={css.price}>
            {addCommaToNum(productReview.order?.originalPrice)}
            {currencyUnit}
          </div>
          <div className={css.shipping}>
            <span>
              {moment(productReview.order?.orderTimestamp).format(
                dateFormat.YYYYMMDD_UI
              )}
            </span>
            <span> </span>
            <span>{productReview.order?.purchaseStatusText}</span>
          </div>
        </div>
      </div>
      <div className={css.detailWrap}>
        <div className={css.detailItemWrap}>
          <div>
            <div className={css.detailButtonWrap}>
              <div className={css.detailButton}>
                <div>사이즈</div>
                <div className={css.detailLine} />
                <div className={css.detailText}>
                  {productReview.reviewTexts.size}
                </div>
              </div>
            </div>
            <div className={css.detailButtonWrap}>
              <div className={css.detailButton}>
                <div>컬러</div>
                <div className={css.detailLine} />
                <div className={css.detailText}>
                  {productReview.reviewTexts.color}
                </div>
              </div>
            </div>
            <div className={css.detailButtonWrap}>
              <div className={css.detailButton}>
                <div>길이감</div>
                <div className={css.detailLine} />
                <div className={css.detailText}>
                  {productReview.reviewTexts.length}
                </div>
              </div>
            </div>
          </div>
          <div className={css.contents}>
            {Array.isArray(toJS(productReview.reviewPhotos))
              ? productReview.reviewPhotos
                  .filter(p => p.photoOrder === 0)
                  .slice(0, 1)
                  .map((photo, photoIndex) => (
                    <div
                      className={css.detailImageBox}
                      style={{
                        backgroundImage: `url(${photo.reviewPhotoUrl})`,
                      }}
                      key={photoIndex}
                    />
                  ))
              : null}
            <div
              className={cn({
                [css.contentItemWithImage]: Array.isArray(
                  toJS(productReview.reviewPhotos)
                ),
              })}
            >
              <div className={css.detailStarWrap}>
                {StarItem(productReview.review.productRating)}
                <span className={css.detailStarText}>
                  {StarCount(productReview.review.productRating)}점
                </span>
              </div>
              {/* 리뷰 본문 */}
              <div className={css.textReview}>
                {productReview.review.textReview}
              </div>

              <div className={css.date}>
                {moment(productReview.review.createdAtTimestamp).format(
                  dateFormat.YYYYMMDD_UI
                )}
                {` `}
                {moment(productReview.review.createdAtTimestamp).format(
                  dateFormat.HHMM
                )}
              </div>

              {/* <div className={css.likeWrap}>
                <span>도움되었어요</span>
                <div className={css.likeImage} />
                <span className={css.like}>
                  {` ${productReview.review.bookmarkCount}`}
                </span>
                <div className={css.likeline} />
            <span>댓글 *0개</span>
              </div> */}
            </div>
            <div className={css.actionBox}>
              <button
                onClick={() =>
                  onClickReviewButton(productReview.order, productReview)
                }
              >
                리뷰수정
              </button>
              {/* <button onClick={() => onClickDeleteButton(productReview)}>
            삭제
          </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
