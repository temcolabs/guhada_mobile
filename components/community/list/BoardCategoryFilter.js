import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import cn from 'classnames';
import css from './BoardCategoryFilter.module.scss';
import { withRouter } from 'next/router';
import useBBSSearchState from 'components/community/list/useBBSSearchState';
import { useBBSStore } from 'stores/bbs';
import { useObserver } from 'mobx-react';
import SlideUpOptions, { slideOptionsPropType } from '../form/SlideUpOptions';
import useChangeOption from 'lib/hooks/useChangeOption';
import { func } from 'prop-types';

BoardCategoryFilter.prototype = {
  options: slideOptionsPropType,
  onChange: func,
};

function BoardCategoryFilter({
  router = {},
  options = [], //
  onChange = (value) => {},
  initialValue,
  wrapperStyle = {},
  optionsWrapperStyle = { width: '130px' },
}) {
  const { searchQuery, handleChangeCategoryFilter } = useBBSSearchState({
    query: router.query,
    asPath: router.asPath,
  });
  const { categoryFilter: categoryFilterStore } = useBBSStore();
  const [filterId, setFilterId] = useState(null); // 목록 카테고리

  /**
   * 카테고리 필터 선택
   */
  const handleClickCategory = (newFilterId) => {
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
    return categoryFilterStore.categoryFiltersWithAllOptions.length > 0 ? (
      <div
        key={searchQuery.categoryId}
        className={css.wrap}
        style={wrapperStyle}
      >
        <SlideUpOptions
          renderButton={() => {
            return (
              <div className={css.wrap}>
                <button className={css.categoryButton}>말머리 선택</button>
              </div>
            );
          }}
          options={categoryFilterStore.categoryFiltersWithAllOptions} // 현재 선택된 값은 제외하고
          onChangeOption={handleClickCategory}
          wrapperStyle={{
            display: 'inline-block',
          }}
          slideWrapperStyle={optionsWrapperStyle}
          topPosOnEnter={'30px'}
          topPosOnExit={'60px'}
        />
      </div>
    ) : null;
  });
}
export default withRouter(BoardCategoryFilter);
