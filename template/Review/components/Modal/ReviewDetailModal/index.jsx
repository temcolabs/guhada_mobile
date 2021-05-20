import React, { useEffect, memo } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import moment from 'moment';

import AdBanner from 'components/community/AdBanner';
import CardImage from 'template/Review/components/Card/CardImage';
import CardRating from 'template/Review/components/Card/CardRating';
import CardLabels from 'template/Review/components/Label';
import CardProdInfo from 'template/Review/components/Card/CardProdInfo';

import HashtagItem from 'template/Review/components/Atoms/Label/HashtagItem';

import {
  Wrapper,
  BigDivider,
  ContentSection,
  Contents,
  ContentDate,
  HashTagSection,
  RecommendHeader,
} from './Styled';

import HeaderModalWrapper from 'components/molecules/Modal/HeaderModalWrapper';
import DealSection from 'components/organisms/DealSection';
import ReviewSection from 'components/organisms/ReviewSection';
import CommentSection from 'components/organisms/CommentSection';

function ReviewDetailModal({ reviewId, isModalOpen, onCloseModal }) {
  const {
    review: reviewStore,
    login: loginStore,
    alert: alertStore,
    user: userStore,
  } = useStores();
  const { reviewDetail: review } = reviewStore;
  const { reviewDetailComments: comment } = reviewStore;

  const productId = review?.productId;

  // 초기화
  useEffect(() => {
    reviewStore.getReview({ reviewId });
    reviewStore.getReviewComments({ reviewId });
    reviewStore.getRecommendReviews({ reviewId });
    return () => reviewStore.initReviewDetail();
  }, []);

  // 연관 상품
  useEffect(() => {
    if (productId) {
      reviewStore.getDealsOfSameBrand({ productId });
      reviewStore.getDealsOfRecommend({ productId });
    }
  }, [productId]);

  // 좋아요 버튼
  const onClickLike = (review) => {
    if (loginStore.loginStatus === 'LOGIN_DONE') {
      const isLike = review?.myBookmarkReview;
      if (isLike) {
        reviewStore.delProductReviewBookmarks(review);
      } else {
        reviewStore.setProductReviewBookmarks(review);
      }
    } else {
      alertStore.showAlert('로그인이 필요한 서비스입니다.');
    }
  };

  // 댓글 기능...
  const onClickComment = () => {};
  
  /**
   * 댓글 등록 이벤트
   * @param {String} comment, 댓글 텍스트
   */
  const onClickCommentSubmit = async (comment) => {
    const userId = userStore?.userInfo?.id;
    if (!userId) {
      alertStore.showAlert('로그인이 필요한 서비스입니다.');
    } else {
      await reviewStore.createReviewComments({
        reviewId,
        param: { comment }, // comment, mentionUserId
      });
      await reviewStore.getReviewComments({ reviewId });
    }
  };

  /**
   * 댓글 삭제 이벤트
   * @param {Number} commentId, 댓글 ID 
   */
  const onClickCommentDelete = async (commentId) => {
    const userId = userStore?.userInfo?.id;
    if (!userId) {
      alertStore.showAlert('로그인이 필요한 서비스입니다.');
    } else {
      await reviewStore.deleteReviewComments({ commentId });
      await reviewStore.getReviewComments({ reviewId });
    }
  };
  
  const onClickReport = () => {};

  return (
    <>
      {review ? (
        <HeaderModalWrapper
          isModalOpen={isModalOpen}
          headerStatus={{ title: review?.nickname, back: true, close: true }}
          onCloseModal={onCloseModal}
          onClickBackModal={onCloseModal}
        >
          {/* ReviewDetail Section으로 분리 */}
          <Wrapper>
            {/* 메인 이미지 */}
            <CardImage images={review?.reviewImageList} type={'detail'} />
            {/* 좋아요, 댓글, 별점 카운팅 */}
            <CardRating review={review} onClickLike={onClickLike} />

            {/* 리뷰 컨텐츠 */}
            <ContentSection>
              {/* 사이즈, 컬러, 길이 라벨 */}
              <CardLabels
                answers={review?.reviewAnswers}
                questions={review?.reviewQuestions}
              />
              {/* 본문 */}
              <Contents>{review?.contents}</Contents>
              {/* 작성 시간 */}
              <ContentDate>
                {moment(review?.createdTimestamp).format('YY.MM.DD HH:mm')}
              </ContentDate>
              {/* 해시태그 리스트 */}
              {review.hashtagList ? (
                <HashTagSection>
                  {review.hashtagList.map((v) => (
                    <HashtagItem hashtag={v} />
                  ))}
                </HashTagSection>
              ) : (
                ''
              )}
            </ContentSection>

            {/* 상품 */}
            <CardProdInfo
              dealId={review?.dealId}
              imageUrl={review?.productImageUrl}
              title={review?.brandName}
              contents={review?.dealName}
            />
          </Wrapper>

          {/* 배너 */}
          <AdBanner dots={false} />

          {/* 댓글 */}
          <CommentSection
            comment={comment}
            onClickCommentSubmit={onClickCommentSubmit}
            onClickCommentDelete={onClickCommentDelete}
          />

          {/* 구분선 */}
          <BigDivider />

          {/* 상품 추천 */}
          {reviewStore?.dealsOfSameBrand && (
            <DealSection
              horizontal
              header={'비슷한 상품'}
              headerStyles={{
                fontFamily: 'Roboto',
                fontSize: '16px',
                textAlign: 'left',
                paddingLeft: '20px',
                marginBottom: '12px',
              }}
              deals={reviewStore?.dealsOfSameBrand}
            />
          )}
          {reviewStore?.dealsOfRecommend && (
            <DealSection
              horizontal
              header={'추천 상품'}
              headerStyles={{
                fontFamily: 'Roboto',
                fontSize: '16px',
                textAlign: 'left',
                paddingLeft: '20px',
                marginBottom: '12px',
              }}
              deals={reviewStore?.dealsOfRecommend}
            />
          )}

          {/* 구분선 */}
          <BigDivider />

          {/* 추천 리뷰 */}
          <Wrapper>
            <RecommendHeader>추천 리뷰</RecommendHeader>
            {reviewStore?.reviewRecommendList
              ? reviewStore?.reviewRecommendList.map((review, i) => (
                  <ReviewSection
                    key={`ReviewCard-${i}`}
                    review={review}
                    onClickLike={onClickLike}
                  />
                ))
              : ''}
          </Wrapper>
        </HeaderModalWrapper>
      ) : (
        ''
      )}
    </>
  );
}

ReviewDetailModal.propTypes = {};
export default memo(observer(ReviewDetailModal));
