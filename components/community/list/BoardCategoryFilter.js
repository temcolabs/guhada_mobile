import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import cn from 'classnames';
import css from './BoardCategoryFilter.module.scss';
import { withRouter } from 'next/router';
import useBBSSearchState from 'components/community/list/useBBSSearchState';
import { useBBSStore } from 'stores/bbs';
import { useObserver } from 'mobx-react-lite';

function BoardCategoryFilter({ router = {}, wrapperStyle = {} }) {
  const { searchQuery, handleChangeCategoryFilter } = useBBSSearchState({
    query: router.query,
    asPath: router.asPath,
  });
  const { categoryFilter: categoryFilterStore } = useBBSStore();
  const [filterId, setFilterId] = useState(null); // 목록 카테고리

  /**
   * 카테고리 필터 선택
   */
  const handleClickCategory = newFilterId => {
    if (newFilterId !== filterId) {
      setFilterId(newFilterId);
      handleChangeCategoryFilter(newFilterId);
    }
  };

  // 카테고리 아이디가 변경되면 필터 업데이트
  useEffect(() => {
    categoryFilterStore.getCategoryFilters(searchQuery.categoryId);
    return () => {
      categoryFilterStore.getCategoryFilters(null);
    };
  }, [categoryFilterStore, searchQuery.categoryId]);

  // 쿼리스트링에서 필터 아이디 초기값 반영.
  useEffect(() => {
    if (searchQuery.filterId) {
      setFilterId(searchQuery.filterId);
    } else {
      setFilterId(null);
    }

    return () => {
      setFilterId(null);
    };
  }, [searchQuery.filterId]);

  return useObserver(() => {
    return (
      <div
        key={searchQuery.categoryId}
        className={css.wrap}
        style={wrapperStyle}
      >
        {categoryFilterStore.categoryFiltersWithAllOptions.map(
          (filterOption, index) => {
            return (
              <button
                key={index}
                className={cn(css.categoryButton, {
                  [css.isSelected]:
                    filterOption.value === null // 전체 옵션
                      ? _.isNil(filterId) === _.isNil(filterOption.value)
                      : // 필터 아이디 일치 체크
                        parseInt(filterId, 10) === filterOption.value,
                })}
                onClick={() => handleClickCategory(filterOption.value)}
              >
                {filterOption.label}
              </button>
            );
          }
        )}
      </div>
    );
  });
}
export default withRouter(BoardCategoryFilter);
