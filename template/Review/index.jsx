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
        <div className={css['review-banner']} />
        {reviewStore.reviewBannerList && reviewStore.reviewBannerList.length ? (
          <div className={css['review-banner']} />
        ) : (
          ''
        )}
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

        {/* reviewStore.reviewHashTagList.map((o) => (
              
            ))
          : ''} */}
      </div>

      <Footer />
    </DefaultLayout>
  );
}

export default observer(ReviewTemplate);
