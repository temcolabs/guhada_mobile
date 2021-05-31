import React, { useRef, useEffect } from 'react';
import { toJS } from 'mobx';
import css from './BoardMenus.module.scss';
import cn from 'classnames';
import { useBBSStore } from 'stores/bbs';
import { observer } from 'mobx-react-lite';
import useBBSSearchState from '../list/useBBSSearchState';
import { withRouter } from 'next/router';
import { compose } from 'lodash/fp';

const enhancer = compose(
  withRouter,
  observer
);

/**
 * 사이드바 게시판 선택 버튼 그리드
 */
const BoardMenus = ({ router }) => {
  const scrollWrapRef = useRef(null);
  /**
   * NOTE: category를 destructuring 하면 observable이 아닌 js 객체가 리턴됨. 변경을 반영 못함.
   */
  const { category } = useBBSStore();
  const categoriesByCommunity = category.categoriesByCommunity;
  const currentCategoryId = parseInt(router.query.categoryId, 10);
  const {
    handleChangeCategory,
    ALL_CATEGORY_ID,
    POPULAR_CATEGORY_ID, // 인기글
  } = useBBSSearchState({
    query: router.query,
    asPath: router.asPath,
  });

  // 상단 스크롤 정렬
  useEffect(() => {
    const wrap = scrollWrapRef.current;
    if (wrap && wrap.childNodes && wrap.childNodes.length) {
      let target = null;
      for (let i = 0; i < wrap.childNodes.length; i++) {
        const element = wrap.childNodes[i];
        if (element.getAttribute('category') === router.query.categoryId) {
          target = element;
          break;
        }
      }

      if (target) {
        const targetX = target.getBoundingClientRect().x;
        const scrollToWidth = wrap.getBoundingClientRect().width / 2 - 52;
        wrap.scrollTo(targetX - scrollToWidth, 0);
      }
    }
  }, [router.query]);

  return (
    <div className={css.wrap} ref={scrollWrapRef}>
      {/* Default categories */}
      <div className={css.category} key={ALL_CATEGORY_ID}>
        <div
          className={cn(css.dots, {
            [css.inActive]: ALL_CATEGORY_ID !== router.query.categoryId,
          })}
        />
        <button
          className={cn(css.menuButton, {
            [css.isSelected]: ALL_CATEGORY_ID === router.query.categoryId,
          })}
          onClick={() => handleChangeCategory(ALL_CATEGORY_ID)}
        >
          전체
        </button>
      </div>

      <div className={css.category} key={POPULAR_CATEGORY_ID}>
        <div
          className={cn(css.dots, {
            [css.inActive]: POPULAR_CATEGORY_ID !== router.query.categoryId,
          })}
        />
        <button
          className={cn(css.menuButton, {
            [css.isSelected]: POPULAR_CATEGORY_ID === router.query.categoryId,
          })}
          onClick={() => handleChangeCategory(POPULAR_CATEGORY_ID)}
        >
          인기글
        </button>
      </div>

      {/* Custom Categories */}
      {categoriesByCommunity.map((item = {}) =>
        item.categories.map((category = {}) => (
          <div
            className={css.category}
            category={category.id}
            key={`${category.name}-${category.id}`}
          >
            <div
              className={cn(css.dots, {
                [css.inActive]: category.id !== currentCategoryId,
              })}
            />
            <button
              key={category.id}
              className={cn(css.menuButton, {
                [css.isSelected]: category.id === currentCategoryId,
              })}
              onClick={() => handleChangeCategory(category.id)}
            >
              {category.name}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default enhancer(BoardMenus);
