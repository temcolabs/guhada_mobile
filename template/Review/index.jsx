import css from './Review.module.scss';
import { useState, useEffect, useCallback, useRef } from 'react';

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
import { Image } from 'components/atoms';
import { Slider } from 'components/molecules';

// TODO : 컴포넌트 옮기기
import StarItem from 'components/mypage/review/StarItem';

import { toJS } from 'mobx';

const settings = {
  arrows: false,
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  variableWidth: true,
};

function ReviewTemplate() {
  /**
   * states
   */
  const { main: mainStore, review: reviewStore } = useStores();
  const [reviewCategoryList, setReviewCategoryList] = useState(
    REVIEW_CATEGORY_LIST
  );
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
    reviewStore.getReviewBannerList();
    reviewStore.getReviewPopularHashTag();
  }, [reviewStore]);

  /**
   * 카테고리 변경
   */
  useEffect(() => {
    const activeCategory = reviewCategoryList.find((o) => o.isSelect);
    reviewStore.getReviewList(1, 20, activeCategory.categoryName);
  }, [reviewCategoryList]);

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

  // TODO : Hooks 사용
  useEffect(() => {
    window.addEventListener('scroll', handleScrollDirection);
    return () => window.removeEventListener('scroll', handleScrollDirection);
  }, [handleScrollDirection]);

  /**
   * 1. 스토어 확인
   * 2. last : false
   * 3. 임계점, 호출
   */

  /**
   * handlers
   */
  const onClickReviewCategory = (idx) => {
    setReviewCategoryList(
      reviewCategoryList.map((o, i) =>
        idx === i ? { ...o, isSelect: true } : { ...o, isSelect: false }
      )
    );
  };

  const onClickLikeReview = (id) => {
     
  }

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

  /**
   * helpers
   */
  const createReviewImages = (list) => {
    return list && list.length
      ? list.map((src) => (
          <div
            style={{ width: '320px' }}
            className={css['review-list-item__image--item']}
          >
            <Image src={src} width={'auto'} height={'320px'} />
          </div>
        ))
      : '';
  };

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
              {/* TODO : 해시태그 기능 구현 */}
              {reviewStore.reviewHashtagList.map((o) => (
                <button className={css['review-hashtag-section--label']}>
                  # {o.hashtag}
                </button>
              ))}
            </div>
          </div>
        ) : (
          ''
        )}

        {/* 리뷰 > 카테고리 */}
        {reviewCategoryList && reviewCategoryList.length ? (
          <div className={css['review-category']}>
            <div className={css['review-category-header']}>
              <div className={css['review-category-header__title']} />
            </div>
            <div className={css['review-category-section']}>
              {/* TODO : 카테고리 조회 구현 */}
              {reviewCategoryList.map((o, i) => (
                <div
                  className={css['review-category-section__card']}
                  onClick={() => onClickReviewCategory(i)}
                >
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
        {reviewStore.reviewItems && reviewStore.reviewItems.length ? (
          <div className={css['review-list']}>
            {reviewStore.reviewItems.map((item) => (
              <div className={css['review-list-item']}>
                {/* 리뷰 > 카드 > 이미지 */}
                <div
                  key={`review-item-${item?.id}`}
                  className={css['review-list-item__image']}
                >
                  {item?.reviewImageList.length <= 1 ? (
                    <div className={css['review-list-item__image--item']}>
                      <Image
                        src={item.reviewImageList[0]}
                        width={'auto'}
                        height={'320px'}
                      />
                    </div>
                  ) : (
                    <Slider
                      ref={sliderRef}
                      children={createReviewImages(item?.reviewImageList)}
                      settings={settings}
                    />
                  )}
                </div>
                {/* 좋아요, 댓글, 별  */}
                <div className={css['review-list-item__info']}>
                  {/* 좋아요, 댓글 */}
                  <div
                    className={css['review-list-item__info--like-and-comment']}
                  >
                    {/* 좋아요 */}
                    <div>
                      <div
                        className={cn(
                          css[`review-list-item__info--like-and-comment`],
                          css[
                            `${item?.myBookmarkReview ? 'like-on' : 'like-off'}`
                          ]
                        )}
                        onClick={() => onClickBookMark(item.id)}
                      />
                      {item?.bookmarkCount}
                    </div>
                    {/* 댓글 */}
                    <div>
                      <div
                        className={cn(
                          css[`review-list-item__info--like-and-comment`],
                          css[`comment`]
                        )}
                      />
                      {item?.commentCount}
                    </div>
                  </div>
                  {/* 별 */}
                  <div>{StarItem(item?.rating)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          ''
        )}
      </div>

      <Footer />
    </DefaultLayout>
  );
}

export default observer(ReviewTemplate);
