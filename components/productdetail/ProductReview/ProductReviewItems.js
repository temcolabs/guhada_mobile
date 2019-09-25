import React, { Component } from 'react';
import css from './ProductReviewItems.module.scss';
import _ from 'lodash';
import StarItem from '../StarItem';
import moment from 'moment';
import { dateFormat } from 'constant/';
import { inject, observer } from 'mobx-react';

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

    return (
      <div className={css.wrap}>
        <div className={css.profileWrap}>
          <div
            className={css.profileImage}
            style={{ backgroundImage: `url(${item.review.profileImageUrl})` }}
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
                {!_.isNil(item.userSize) ? (
                  <div className={css.profileSize}>
                    {`평소사이즈 : ${item.userSize.bottom} / 키 : ${
                      item.userSize.height
                    }`}
                  </div>
                ) : null}
              </div>
              <div className={css.levelWrap}>
                <div>{StarItem(item.review.productRating)}</div>
                {!_.isNil(item.productOption) ? (
                  <div className={css.profileSize}>
                    {`구매옵션 : ${item.productOption.color}/${
                      item.productOption.size
                    }`}
                  </div>
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
          {moment(item.review.createdAt).format(dateFormat.YYYYMMDD_UI)}
          {` `}
          {moment(item.review.createdAt).format(dateFormat.HHMM)}
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
          <div className={css.likeWrap}>
            <div>도움되었어요</div>
            {login.loginStatus === 'LOGIN_DONE' ? (
              _.isNil(checkBookmarks) === true ? (
                <div
                  className={css.likeIcon}
                  onClick={() =>
                    productreview.setProductReviewBookmarks(item.review.id)
                  }
                />
              ) : (
                <div
                  className={css.unLikeIcon}
                  onClick={() =>
                    productreview.delProductReviewBookmarks(item.review.id)
                  }
                />
              )
            ) : (
              <div
                className={css.likeIcon}
                onClick={() => alert.showAlert('로그인이 필요한 서비스입니다.')}
              />
            )}
            <div className={css.bookmarkCount}>{`${
              item.review.bookmarkCount
            }`}</div>
          </div>
          <div className={css.commentWrap}>
            {/* <div>{`-댓글 6개`}</div> */}
            {/* <div className={css.line} /> */}
            <div>신고</div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductReviewItems;
