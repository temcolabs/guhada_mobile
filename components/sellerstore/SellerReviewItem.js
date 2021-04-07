import React, { useState, useEffect } from 'react';
import useStores from 'stores/useStores';
import _ from 'lodash';
import ReviewReply from 'components/productdetail/ReviewReply';
import moment from 'moment';
import { dateFormat } from 'childs/lib/constant';
import { toJS } from 'mobx';
import StarItem from 'components/mypage/review/StarItem';
import css from './SellerReviewItem.module.scss';
function SellerReviewItem(props) {
  const reviewItem = props.review;

  const { seller, sellerReview, login } = useStores();
  const { reviewBookMarks } = sellerReview;
  const [isSellerReplied, setIsSellerReplied] = useState(false);
  let checkBookmarks = false;
  if (login.loginStatus === 'LOGIN_DONE') {
    checkBookmarks =
      _.isNil(reviewBookMarks) === false &&
      reviewBookMarks.find(bookmark => {
        return bookmark.targetId === reviewItem.review.id;
      });
  }

  //컴포넌트가 업데이트되면 초기화 하기위해
  useEffect(() => {
    setIsSellerReplied(false);
  }, [props.review]);

  const setSellerReply = () => {
    setIsSellerReplied(!isSellerReplied);
  };

  return (
    <div>
      <div className={css.wrap}>
        <div className={css.reviewContent}>
          <div className={css.sellerItemTitleWrap}>
            <div className={css.sellerItemBrand}>
              {reviewItem.review.brandName || ''}
            </div>
            <div className={css.sellerItemTitle}>
              {reviewItem.review.dealName || ''}
            </div>
          </div>
          <div className={css.reviewRatingWrap}>
            <div className={css.reviewRating}>
              {StarItem(reviewItem.review.productRating)}
            </div>
            {(reviewItem.productOption &&
              reviewItem.productOption.color !== '') ||
            (reviewItem.productOption &&
              reviewItem.productOption.size !== '') ? (
              <div className={css.reviewProductOption}>
                <div className={css.itemLabel}>구매옵션</div>
                <div className={css.itemValue}>
                  {reviewItem.productOption.color &&
                  reviewItem.productOption.size
                    ? `${reviewItem.productOption.color} , ${
                        reviewItem.productOption.size
                      }`
                    : `${reviewItem.productOption.color ||
                        reviewItem.productOption.size ||
                        ''}`}
                </div>
              </div>
            ) : null}
          </div>
          <div className={css.reviewTag}>
            <div className={css.reviewTagItem}>
              <div className={css.itemLabel}>
                {reviewItem.reviewQuestions[0].type || '사이즈'}
              </div>
              <div className={css.itemValue}>{reviewItem.reviewTexts.size}</div>
            </div>
            <div className={css.reviewTagItem}>
              <div className={css.itemLabel}>
                {reviewItem.reviewQuestions[1].type || '컬러'}
              </div>
              <div className={css.itemValue}>
                {reviewItem.reviewTexts.color}
              </div>
            </div>
            <div className={css.reviewTagItem}>
              <div className={css.itemLabel}>
                {reviewItem.reviewQuestions[2].type || '길이감'}
              </div>
              <div className={css.itemValue}>
                {reviewItem.reviewTexts.length}
              </div>
            </div>
          </div>
          <div className={css.reviewInfo}>
            <div>
              <div className={css.reviewText}>
                {reviewItem.review.textReview}
              </div>

              {Array.isArray(toJS(reviewItem.reviewPhotos)) &&
                reviewItem.reviewPhotos.length && (
                  <div class={css.photoWrapper}>
                    {reviewItem.reviewPhotos.map((photo, index) => (
                      <div
                        className={css.photo}
                        style={{
                          backgroundImage: `url("${
                            photo.reviewPhotoUrl
                          }?w=375")`,
                        }}
                        key={index}
                      />
                    ))}
                  </div>
                )}
              <div className={css.reviewBottom}>
                <div className={css.reviewLikeWrap}>
                  <div>도움되었어요 {`${reviewItem.review.bookmarkCount}`}</div>
                </div>
                {/* TODO 오픈 후 구현사항 리뷰 댓글 */}
                {reviewItem.review.replied ? (
                  <div
                    className={css.sellerReplied}
                    onClick={() => {
                      setSellerReply();
                    }}
                  >
                    댓글 1
                  </div>
                ) : null}

                <div className={css.reviewCreateDate}>
                  {moment(reviewItem.review.createdAtTimestamp).format(
                    dateFormat.YYYYMMDD_UI
                  )}{' '}
                  {moment(reviewItem.review.createdAtTimestamp).format(
                    dateFormat.HHMM
                  )}
                </div>
              </div>
            </div>
          </div>
          {reviewItem.review.replied && isSellerReplied ? (
            <ReviewReply
              reviewItem={reviewItem}
              key={reviewItem.review.id}
              wrapStyle={{ margin: '20px 0 0', fontSize: '13px' }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SellerReviewItem;
