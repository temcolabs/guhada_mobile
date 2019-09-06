import React from 'react';
import css from './ProductReviewItems.module.scss';
import { toJS } from 'mobx';
import _ from 'lodash';
import url from '@storybook/api/dist/modules/url';
import StarItem from '../StarItem';
import moment from 'moment';
import { dateFormat } from 'constant/';

export default function ProductReviewItems({
  review = {
    bookmarksUserIds: 0,
    order: null,
    productOption: { color: '', size: '' },
    review: {
      colorSatisfaction: 'SAME',
      createdAt: '2019-06-24T06:05:04',
      id: 339,
      lengthSatisfaction: 'SHORT',
      bookmarkCount: 0,
      orderProductGroupId: 13170,
      photoCount: 0,
      productId: 12540,
      productRating: 'THREE',
      profileImageUrl:
        'https://s3-ap-northeast-1.amazonaws.com/poc.online-luxury-market/images/users/normal/profile/KakaoTalk_Photo_2019-05-24-14-50-02.jpeg',
      sizeSatisfaction: 'LARGE',
      textReview: '그냥 그래요.그냥 그래요.그냥 그래요.',
      userId: 356,
      userNickname: '정서영님',
    },
    reviewPhotos: null,
    reviewTexts: {
      size: 'Runs Large',
      color: 'Just right',
      length: 'Runs short',
    },
    userSize: { height: 120, weight: 30, top: 'M', bottom: 44, shoe: 205 },
  },
}) {
  return (
    <div className={css.wrap}>
      <div className={css.profileWrap}>
        <div
          className={css.profileImage}
          style={{ backgroundImage: `url(${review.review.profileImageUrl})` }}
        />
        <div className={css.profileContents}>
          <div>
            <div className={css.levelWrap}>
              <div className={css.profileBox}>
                <div className={css.level}>1</div>
              </div>
              <div className={css.userNickname}>
                {review.review.userNickname}
              </div>
              {!_.isNil(review.userSize) ? (
                <div className={css.profileSize}>
                  {`평소사이즈 : ${review.userSize.bottom} / 키 : ${
                    review.userSize.height
                  }`}
                </div>
              ) : null}
            </div>
            <div className={css.levelWrap}>
              <div>{StarItem(review.review.productRating)}</div>
              {!_.isNil(review.productOption) ? (
                <div className={css.profileSize}>
                  {`구매옵션 : ${review.productOption.color}/${
                    review.productOption.size
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
          <div className={css.colored}>{review.reviewTexts.size}</div>
        </div>
        <div className={css.itemWrap}>
          <div>컬러</div>
          <div className={css.line} />
          <div className={css.colored}>{review.reviewTexts.color}</div>
        </div>
        <div className={css.itemWrap}>
          <div>길이감</div>
          <div className={css.line} />
          <div className={css.colored}>{review.reviewTexts.length}</div>
        </div>
      </div>
      <div className={css.contentWrap}>{review.review.textReview}</div>
      <div className={css.dateWrap}>
        {moment(review.review.createdAt).format(dateFormat.YYYYMMDD_UI)}
        {` `}
        {moment(review.review.createdAt).format(dateFormat.HHMM)}
      </div>
      <div className={css.imageWrap}>
        {!_.isNil(review.reviewPhotos) ? (
          <div>
            <img
              className={css.reviewPhotos}
              src={`${review.reviewPhotos[0].reviewPhotoUrl}`}
              alt={`reviewPhoto`}
            />
          </div>
        ) : null}
      </div>
      <div className={css.likeCommentWrap}>
        <div className={css.likeWrap}>
          <div>도움되었어요</div>
          <div className={css.likeIcon} />
          <div className={css.bookmarkCount}>{`${
            review.review.bookmarkCount
          }`}</div>
        </div>
        <div className={css.commentWrap}>
          <div>{`-댓글 6개`}</div>
          <div className={css.line} />
          <div>신고</div>
        </div>
      </div>
    </div>
  );
}
