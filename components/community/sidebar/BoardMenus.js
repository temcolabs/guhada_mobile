import React from 'react';
import css from './BoardMenus.module.scss';
import cn from 'classnames';

import { useBBSStore } from 'stores/bbs';
import { observer } from 'mobx-react-lite';
import useBBSSearchState from '../list/useBBSSearchState';
import { withRouter } from 'next/router';
import { compose } from 'lodash/fp';

const enhancer = compose(withRouter, observer);

/**
 * 사이드바 게시판 선택 버튼 그리드
 */
const BoardMenus = ({ router }) => {
  /**
   * NOTE: category를 destructuring 하면 observable이 아닌 js 객체가 리턴됨. 변경을 반영 못함.
   */
  const { category } = useBBSStore();
  const categoriesByCommunity = category.categoriesByCommunity;
  const {
    handleChangeCategory,
    ALL_CATEGORY_ID,
    POPULAR_CATEGORY_ID, // 인기글
  } = useBBSSearchState({
    query: router.query,
    asPath: router.asPath,
  });

  const currentCategoryId = parseInt(router.query.categoryId, 10);

  return (
    <div className={css.wrap}>
      <div className={css.category} key={ALL_CATEGORY_ID}>
        <button
          className={cn(css.menuButton, {
            [css.isSelected]: ALL_CATEGORY_ID === router.query.categoryId,
          })}
          onClick={() => handleChangeCategory(ALL_CATEGORY_ID)}
        >
          전체글
        </button>
      </div>

      <div className={css.category} key={POPULAR_CATEGORY_ID}>
        <button
          className={cn(css.menuButton, {
            [css.isSelected]: POPULAR_CATEGORY_ID === router.query.categoryId,
          })}
          onClick={() => handleChangeCategory(POPULAR_CATEGORY_ID)}
        >
          인기글
        </button>
      </div>

      {categoriesByCommunity.map((item = {}) => {
        // 상위 카테고리를 선택했을 때 이동할 기본 카테고리
        const defaultCategory =
          item.categories.length > 0 ? item.categories[0].id : {};

        return (
          <div className={css.category} key={item.community.id}>
            {/* 커뮤니티의 첫번째 카테고리로 이동 */}
            <button
              className={css.menuButton}
              onClick={() => handleChangeCategory(defaultCategory)}
            >
              {item.community?.name}
            </button>

            <div className={css.menuList}>
              {item.categories.map((category = {}) => {
                return (
                  <button
                    key={category.id}
                    className={cn(css.menuButton, {
                      [css.isSelected]: category.id === currentCategoryId,
                    })}
                    onClick={() => handleChangeCategory(category.id)}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default enhancer(BoardMenus);
