import React, { Component } from 'react';
import css from './ProductReviewItems.module.scss';
import _ from 'lodash';
import StarItem from '../StarItem';
import moment from 'moment';
import { dateFormat } from 'constant/';
import { inject, observer } from 'mobx-react';
import { pushRoute } from 'lib/router';

@inject('productreview', 'login', 'alert')
@observer
class ProductReviewItems extends Component {
  render() {
    const { review: item, productreview, login, alert } = this.props;
    const { reviewBookMarks } = productreview;
    let checkBookmarks = false;
    if (login.loginStatus === 'LOGIN_DONE') {
      checkBookmarks =
        _.isNil(reviewBookMarks) === false &&
        reviewBookMarks.find(bookmark => {
          return bookmark.targetId === item.review.id;
        });
    }

    // 출시 후 수정 필요
    let renderUserSize;

    if (_.isNil(item.userSize) === false) {
      renderUserSize = '';
      if (
        _.isNil(item.userSize.height) === false &&
        _.isNil(item.userSize.weight) === false
      ) {
        renderUserSize = (
          <div className={css.profileSize}>
            {`키 : ${item.userSize.height}cm / 몸무게 : ${
              item.userSize.weight
            }kg`}
          </div>
        );
      } else if (_.isNil(item.userSize.height) === false) {
        renderUserSize = (
          <div className={css.profileSize}>
            {`키 : ${item.userSize.height}cm`}
          </div>
        );
      } else if (_.isNil(item.userSize.weight) === false) {
        renderUserSize = (
          <div className={css.profileSize}>
            {`몸무게 : ${item.userSize.weight}kg`}
          </div>
        );
      }
    }

    let renderProductoption;

    if (_.isNil(item.productOption) === false) {
      renderProductoption = '';
      if (
        _.isNil(item.productOption.color) === false &&
        _.isNil(item.productOption.size) === false
      ) {
        renderProductoption = `구매옵션 | ${item.productOption.color} / ${
          item.productOption.size
        }`;
      } else if (_.isNil(item.productOption.color) === false) {
        renderProductoption = `구매옵션 | ${item.productOption.color}`;
      } else if (_.isNil(item.productOption.size) === false) {
        renderProductoption = `구매옵션 | ${item.productOption.size}`;
      }
    }
    return (
      <div className={css.wrap}>
        <div className={css.profileWrap}>
          <div
            className={css.profileImage}
            style={
              _.isNil(item.review) === false &&
              _.isNil(item.review.profileImageUrl) === false
                ? {
                    backgroundImage: `url(${item.review.profileImageUrl})`,
                  }
                : null
            }
          />
          <div className={css.profileContents}>
            <div>
              <div className={css.levelWrap}>
                {/* 추후 적용 */}
                {/* <div className={css.profileBox}>
                <div className={css.level}>1</div>
              </div> */}
                <div className={css.userNickname}>
                  {item.review.userNickname}
                </div>
                {/* 유저 사이즈 */}
                {renderUserSize}
              </div>
              <div className={css.levelWrap}>
                <div>{StarItem(item.review.productRating)}</div>
                {!_.isNil(item.productOption) ? (
                  <div className={css.profileSize}>{renderProductoption}</div>
                ) : null}
              </div>
            </div>
            <div />
          </div>
        </div>
        <div className={css.sizeWrap}>
          <div className={css.itemWrap}>
            <div>사이즈</div>
            <div className={css.line} />
            <div className={css.colored}>{item.reviewTexts.size}</div>
          </div>
          <div className={css.itemWrap}>
            <div>컬러</div>
            <div className={css.line} />
            <div className={css.colored}>{item.reviewTexts.color}</div>
          </div>
          <div className={css.itemWrap}>
            <div>길이감</div>
            <div className={css.line} />
            <div className={css.colored}>{item.reviewTexts.length}</div>
          </div>
        </div>
        <div className={css.contentWrap}>{item.review.textReview}</div>
        <div className={css.dateWrap}>
          {moment(item.review.createdAtTimestamp).format(
            dateFormat.YYYYMMDD_UI
          )}
          {` `}
          {moment(item.review.createdAtTimestamp).format(dateFormat.HHMM)}
        </div>
        <div className={css.imageWrap}>
          {!_.isNil(item.reviewPhotos) ? (
            <div>
              <img
                className={css.reviewPhotos}
                src={`${item.reviewPhotos[0].reviewPhotoUrl}`}
                alt={`reviewPhoto`}
              />
            </div>
          ) : null}
        </div>
        <div className={css.likeCommentWrap}>
          {login.loginStatus === 'LOGIN_DONE' ? (
            _.isNil(checkBookmarks) === true ? (
              <div
                className={css.likeWrap}
                onClick={() =>
                  productreview.setProductReviewBookmarks(item.review.id)
                }
              >
                <div>도움되었어요</div>
                <div className={css.likeIcon} />
                <div className={css.bookmarkCount}>{`${
                  item.review.bookmarkCount
                }`}</div>
              </div>
            ) : (
              <div
                className={css.likeWrap}
                onClick={() =>
                  productreview.delProductReviewBookmarks(item.review.id)
                }
              >
                <div>도움되었어요</div>
                <div className={css.unLikeIcon} />
                <div className={css.bookmarkCount}>{`${
                  item.review.bookmarkCount
                }`}</div>
              </div>
            )
          ) : (
            <div className={css.likeWrap} onClick={() => pushRoute(`/login`)}>
              <div>도움되었어요</div>
              <div className={css.likeIcon} />
              <div className={css.bookmarkCount}>{`${
                item.review.bookmarkCount
              }`}</div>
            </div>
          )}

          <div className={css.commentWrap}>
            {/* <div>{`-댓글 6개`}</div> */}
            {/* <div className={css.line} /> */}
            {/* <div>신고</div> */}
          </div>
        </div>
      </div>
    );
  }
}

export default ProductReviewItems;
