import css from './Review.module.scss';
import { useState, useEffect, useCallback } from 'react';
import Proptypes from 'prop-types';
import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import cn from 'classnames';
import _ from 'lodash';

import useStores from 'stores/useStores';
import { mainCategory } from 'childs/lib/constant/category';

import DefaultLayout from 'components/layout/DefaultLayout';
import Footer from 'components/footer/Footer';
import CategorySlider from 'components/common/CategorySlider';

import { REVIEW_CATEGORY_LIST } from './_constants';

import { toJS } from 'mobx';

function ReviewTemplate() {
  /**
   * states
   */
  const { main: mainStore, review: reviewStore } = useStores();
  const [scrollDirection, setScrollDirection] = useState('up');
  let lastScrollTop = 0;

  /**
   * side effects
   */
  useEffect(() => {
    reviewStore.getReviewBannerList();
    reviewStore.getReviewPopularHashTag();
  }, [reviewStore]);

  // TODO : Hooks 사용
  useEffect(() => {
    window.addEventListener('scroll', handleScrollDirection);
    return () => window.removeEventListener('scroll', handleScrollDirection);
  }, [handleScrollDirection]);

  /**
   * handlers
   */
  // TODO : Hooks 사용
  const handleScrollDirection = useCallback(
    _.debounce((e) => {
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

  console.log(
    'reviewStore.reviewHashtagList : ',
    toJS(reviewStore.reviewHashtagList)
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

      <div className={css['review']}>
        {/* 리뷰 > 배너 */}
        <div className={css['review-banner']} />
        {reviewStore.reviewBannerList && reviewStore.reviewBannerList.length ? (
          <div className={css['review-banner']} />
        ) : (
          ''
        )}

        {/* 리뷰 > 해시태그 */}
        {reviewStore.reviewHashtagList &&
        reviewStore.reviewHashtagList.length ? (
          <div className={css['review-hashtag']}>
            <div className={css['review-hashtag-header']}>
              <div className={css['review-hashtag-header__title']} />
              <div className={css['review-hashtag-header__emoji']} />
            </div>
            <div className={css['review-hashtag-section']}>
              {reviewStore.reviewHashtagList.map((o) => (
                <div className={css['review-hashtag-section--label']}>
                  # {o.hashtag}
                </div>
              ))}
            </div>
          </div>
        ) : (
          ''
        )}

        {/* 리뷰 > 카테고리 */}
        {REVIEW_CATEGORY_LIST && REVIEW_CATEGORY_LIST.length ? (
          <div className={css['review-category']}>
            <div className={css['review-category-header']}>
              <div className={css['review-category-header__title']} />
            </div>
            <div className={css['review-category-section']}>
              {REVIEW_CATEGORY_LIST.map((o) => (
                <div className={css['review-category-section__card']}>
                  <div
                    className={cn(
                      css[`review-category-section__card--category-img`],
                      css[
                        `${
                          o.isSelect
                            ? `${o.categoryImageOn}`
                            : `${o.categoryImageOff}`
                        }`
                      ]
                    )}
                  />
                  <div
                    className={cn(
                      css[`review-category-section__card--category-text`],
                      css[`${o.isSelect ? 'active' : 'inActive'}`]
                    )}
                  >
                    {o.categoryName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          ''
        )}

        {/* 리뷰 > 카드 */}
      </div>

      <Footer />
    </DefaultLayout>
  );
}

export default observer(ReviewTemplate);
