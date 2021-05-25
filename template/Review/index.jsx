import { memo, useEffect } from 'react';
import Proptypes from 'prop-types';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { stringify } from 'qs';
import useStores from 'stores/useStores';

import CategorySlider from 'components/common/CategorySlider';
import DefaultLayout from 'components/layout/DefaultLayout';
import Footer from 'components/footer/Footer';
import { ReviewHashTag, ReviewCategories } from './components';
import ReviewSection from 'components/organisms/ReviewSection';

import { pushRoute } from 'childs/lib/router';
import { mainCategory } from 'childs/lib/constant/category';
import { useScrollDirection, useScrollPosition } from 'hooks';

import { REVIEW_CATEGORY_LIST } from './_constants';
import { Wrapper } from './Styled';

/**
 * ReviewTemplate
 * @returns
 */
function ReviewTemplate() {
  /**
   * states
   */
  const {
    alert: alertStore,
    main: mainStore,
    review: reviewStore,
    login: loginStore,
  } = useStores();
  const { reviewList: reviews } = reviewStore;

  const scrollDirection = useScrollDirection();
  const scrollPosition = useScrollPosition();

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
    reviewStore.initReviewStore();
    const search = { ...reviewStore.searchForm, categoryName };
    await reviewStore.getReviewList(search);
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
      alertStore.showAlert('로그인이 필요한 서비스입니다.');
    }
  };

  const onClickProduct = (dealId) =>
    pushRoute(`/productdetail?deals=${dealId}`);

  const onClickHashtag = (hashtag) =>
    pushRoute(`/review/hashtag?${stringify({ hashtag })}`);

  return (
    <>
      <DefaultLayout
        title={null}
        topLayout={'main'}
        scrollDirection={scrollDirection}
      >
        <CategorySlider
          categoryList={mainCategory.item}
          setNavDealId={mainStore.setNavDealId}
          scrollDirection={scrollDirection}
        />

        <Wrapper>
          {/* 리뷰 > 배너 */}
          {/* <ReviewBanner /> */}

          {/* 리뷰 > 인기 해시태그 */}
          <ReviewHashTag
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
            <div>
              {reviews.map((review, i) => (
                <ReviewSection
                  isLazy={true}
                  key={`ReviewSection-${i}`}
                  review={review}
                  onClickLike={onClickLike}
                  onClickProduct={onClickProduct}
                />
              ))}
            </div>
          ) : (
            ''
          )}
        </Wrapper>
        <Footer />
      </DefaultLayout>
    </>
  );
}

ReviewTemplate.propTypes = {
  banners: Proptypes.array,
  hashTags: Proptypes.array,
};

export default memo(observer(ReviewTemplate));
