import css from './Review.module.scss';
import { useState, useEffect, useCallback, useRef } from 'react';

import Proptypes from 'prop-types';
import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { debounce } from 'lodash';

import useStores from 'stores/useStores';
import { mainCategory } from 'childs/lib/constant/category';

import DefaultLayout from 'components/layout/DefaultLayout';
import Footer from 'components/footer/Footer';
import CategorySlider from 'components/common/CategorySlider';

import { REVIEW_CATEGORY_LIST } from './_constants';
import { Image } from 'components/atoms';

import { toJS } from 'mobx';

import { Wrapper } from './Styled';
import {
  ReviewBanner,
  ReviewHashTag,
  ReviewCategories,
  ReviewCard,
} from './components';

function ReviewTemplate({ banners, hashTags }) {
  /**
   * states
   */
  const { main: mainStore, review: reviewStore } = useStores();
  const [reviews, setReviews] = useState([]);
  const [scrollDirection, setScrollDirection] = useState('up');

  const sliderRef = useRef(null);

  let lastScrollTop = 0;

  /**
   * side effects
   */

  /**
   * 초기화
   */

  useEffect(() => {
    initReviewPage();
  }, []);

  useEffect(() => {
    const content = toJS(reviewStore?.reviewPage?.content);
    if (content && content.length) {
      setReviews([...reviews, ...content]);
    }
  }, [reviewStore.reviewPage]);

  /**
   * React-slick, 간격 수정
   */
  useEffect(() => {
    let slickSlides = document.querySelectorAll('.slick-slide');
    if (slickSlides && slickSlides.length) {
      slickSlides.forEach((o, i) => {
        o.style.marginRight = '7px';
      });
    }
  }, [sliderRef.current]);

  /**
   * Helpers
   */
  const initReviewPage = async () => {
    reviewStore.initReviewPage();
    reviewStore.initSearchForm();
    await reviewStore.getReviewList(reviewStore.searchForm);
  };

  /**
   * 1. 스토어 확인
   * 2. last : false
   * 3. 임계점, 호출
   */

  // TODO : Hooks 사용
  const handleScrollDirection = useCallback(
    debounce((e) => {
      let st = window.pageYOffset || document.documentElement.scrollTop;
      if (st > lastScrollTop) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      lastScrollTop = st <= 0 ? 0 : st;
    }, 10),
    []
  );

  return (
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
        {banners?.length ? <ReviewBanner banners={banners} /> : ''}

        {/* 리뷰 > 인기 해시태그 */}
        {hashTags?.length ? <ReviewHashTag hashTags={hashTags} /> : ''}

        {/* 리뷰 > 카테고리 */}
        <ReviewCategories categories={REVIEW_CATEGORY_LIST} />

        {/* 리뷰 > 카드 */}
        {reviews && reviews.length ? (
          <div>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          ''
        )}
      </Wrapper>
      <Footer />
    </DefaultLayout>
  );
}

export default observer(ReviewTemplate);
