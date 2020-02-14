import React, { useState, useEffect, useRef } from 'react';
import CommunityLayout from 'components/community/CommunityLayout';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import css from './BBSList.module.scss';
import cn from 'classnames';
import { withRouter } from 'next/router';
import { compose } from 'lodash/fp';
import Pagination from 'components/common/Pagination';
import BoardTitle from 'components/community/list/BoardTitle';
import BoardSearch from 'components/community/list/BoardSearch';
import BoardListItem from 'components/community/list/BoardListItem';

// import useStores from 'stores/useStores';
// import AdBanner from 'components/community/AdBanner';
import CommunityContentWrap from 'components/community/CommunityContentWrap';
import { useBBSStore } from 'stores/bbs';
import useBBSSearchState from 'components/community/list/useBBSSearchState';
import { ITEMS_PER_PAGE } from 'childs/lib/constant/community/searchQuery';
import { useObserver } from 'mobx-react-lite';
import BoardGridItem, {
  BoardGridContainer,
} from 'components/community/list/BoardGridItem';
import categoryViewType from 'childs/lib/constant/community/categoryViewType';
import MoreButton from 'components/common/MoreButton';
import BoardCategoryFilter from 'components/community/list/BoardCategoryFilter';

const enhancer = compose(
  withScrollToTopOnMount,
  withRouter
);

/**
 * 게시판. 게시글 목록
 */
const BBSList = enhancer(({ router }) => {
  const {
    searchQuery,
    boardTitle,
    handleChangePage,
    handleSubmitSearch,
    handleChangeOrder,
    scrollUpTargetId,
    ALL_CATEGORY_ID,
    POPULAR_CATEGORY_ID,
  } = useBBSSearchState({
    query: router.query,
    asPath: router.asPath,
  });

  const { search: searchStore, category: categoryStore } = useBBSStore();

  // 검색용 쿼리 변경되었을 때 검색 실행
  useEffect(() => {
    searchStore.searchWithPost({
      categoryId: searchQuery.categoryId,
      deleted: searchQuery.deleted,
      filterId: searchQuery.filterId,
      inUse: searchQuery.inUse,
      query: searchQuery.query,
      searchType: searchQuery.searchType,
      order: searchQuery.order,
      page: searchQuery.page,
      unitPerPage: searchQuery.unitPerPage,
    });

    return () => {
      // searchQuery 바뀌면 검색 결과 초기화
      searchStore.cleanResults();
    };
  }, [searchQuery, searchStore]);

  const currentCategory = categoryStore.getCategoryById(searchQuery.categoryId);

  // 리스트 표시 형식. 현재 카테고리의 타입을 확인한다
  // 현재 타입이 2개여서 TEXT가 아니면 그리드 뷰로 표시
  const isNormalView =
    searchQuery.categoryId === ALL_CATEGORY_ID ||
    searchQuery.categoryId === POPULAR_CATEGORY_ID ||
    currentCategory.type === categoryViewType.TEXT
      ? true
      : false;

  console.log(
    searchQuery.page * searchQuery.unitPerPage,
    'searchQuery.page * searchQuery.unitPerPage'
  );
  return useObserver(() => (
    <CommunityLayout>
      <div id={scrollUpTargetId} />

      {/* 광고 */}
      {/* <AdBanner /> */}

      {/* 게시판 */}
      <CommunityContentWrap>
        {/* 게시판 이름 */}
        <BoardTitle />

        {/* 목록 */}
        <div
          className={cn(css.boardListContainer, {
            [css.isFetching]: searchStore.isFetching,
          })}
        >
          {isNormalView ? ( // 일반 리스트 뷰
            searchStore.bbsList.map(bbs => {
              return <BoardListItem key={bbs.bbsId} bbs={bbs} />;
            })
          ) : (
            // 그리드 뷰
            <BoardGridContainer>
              {searchStore.bbsList.map((bbs, index) => {
                return bbs ? <BoardGridItem bbs={bbs} key={index} /> : null;
              })}
            </BoardGridContainer>
          )}
        </div>

        {/* 페이지네이션 */}
        {/* {!searchStore.isFetching && (
          <Pagination
            wrapperStyle={{ marginTop: isNormalView ? '62px' : '20px' }}
            onChangePage={handleChangePage}
            initialPage={parseInt(searchQuery.page, 10)}
            itemsCountPerPage={ITEMS_PER_PAGE}
            totalItemsCount={searchStore.totalCount}
          />
        )} */}

        {searchStore.totalCount > searchQuery.page * searchQuery.unitPerPage ? (
          <MoreButton
            getMoreContent={() => {
              searchStore.moreBBSList();
            }}
          />
        ) : null}

        {/* 검색어 입력  */}
        {!searchStore.isFetching && (
          <div className={css.boardSearchWrap}>
            <BoardSearch
              onSubmitSearch={handleSubmitSearch}
              initialSearchType={searchQuery.searchType}
              initialQuery={searchQuery.query}
            />
          </div>
        )}
      </CommunityContentWrap>
    </CommunityLayout>
  ));
});

export default BBSList;
