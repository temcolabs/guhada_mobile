import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { stringify } from 'qs';
import useStores from 'stores/useStores';
import { pushRoute, sendBackToLogin } from 'childs/lib/router';
import { useScrollPosition } from 'hooks';

import {
  ReviewCategories,
  ReviewFavoriteHashtagList,
} from 'template/Review/components/molecules';
import { ReviewCardSection } from 'template/Review/components/organisms';

import { REVIEW_CATEGORY_LIST } from './_constants';
import { ReviewWrapper, ReviewContents } from './Styled';

/**
 * ReviewTemplate
 * @returns
 */
function ReviewTemplate() {
  /**
   * states
   */
  const { review: reviewStore, login: loginStore } = useStores();
  const { reviewList: reviews } = reviewStore;

  const { scrollPosition } = useScrollPosition();

  /**
   * side effects
   */
  useEffect(() => {
    reviewStore.getReviewList(reviewStore?.searchForm);
    reviewStore.getReviewHashtags();
    return () => {
      reviewStore.initReviewStore();
    };
  }, []);

  // Review data imported in infinite scrolls
  useEffect(() => {
    if (scrollPosition > 0.7) {
      getReviewList();
    }

    async function getReviewList() {
      const reviewPage = reviewStore?.reviewPage;
      if (!reviewPage.last) {
        document.documentElement.style.overflow = 'hidden';
        const searchForm = reviewStore?.searchForm;
        const search = { ...searchForm, page: searchForm.page + 1 };

        await reviewStore.getReviewList(search);
        reviewStore.setSearchForm(search);
        document.documentElement.style.overflow = 'initial';
      }
    }
  }, [reviewStore, scrollPosition]);

  /**
   * Handlers
   */
  // Clicked category item
  const onClickCategory = async (categoryName) => {
    const search = { ...reviewStore.searchForm, categoryName };

    reviewStore.initReviewStore();
    reviewStore.getReviewList(search);
    reviewStore.getReviewHashtags();
    reviewStore.setSearchForm(search);
  };

  // Clicked like button
  const onClickLike = async (review) => {
    if (loginStore.loginStatus === 'LOGIN_DONE') {
      const isLike = review?.myBookmarkReview;
      if (isLike) {
        await reviewStore.delProductReviewBookmarks(review);
      } else {
        await reviewStore.setProductReviewBookmarks(review);
      }
    } else {
      sendBackToLogin();
    }
  };

  const onClickProduct = (dealId) =>
    pushRoute(`/productdetail?deals=${dealId}`);

  const onClickHashtag = (hashtag) =>
    pushRoute(`/review/hashtag?${stringify({ hashtag })}`);

  return (
    <ReviewWrapper>
      {/* 리뷰 > 배너 */}
      {/* TODO : 배너 추가되는 경우, 인기 해시태그 padding 정리 */}
      {/* <ReviewBanner /> */}

      {/* 리뷰 > 인기 해시태그 */}
      <ReviewFavoriteHashtagList
        hashtags={reviewStore.reviewHashtagList}
        onClickHashtag={onClickHashtag}
      />

      {/* 리뷰 > 카테고리 */}
      <ReviewCategories
        categories={REVIEW_CATEGORY_LIST}
        onClickCategory={onClickCategory}
      />

      {/* 리뷰 > 카드 */}
      {reviews && reviews.length ? (
        <ReviewContents>
          {reviews.map((review, i) => (
            <ReviewCardSection
              isLazy={true}
              key={`ReviewSection-${i}`}
              review={review}
              onClickLike={onClickLike}
              onClickProduct={onClickProduct}
            />
          ))}
        </ReviewContents>
      ) : (
        ''
      )}
    </ReviewWrapper>
  );
}
export default observer(ReviewTemplate);
