import React, { useEffect } from 'react';
import CommunityContentWrap from 'components/community/CommunityContentWrap';
import { useBBSStore } from 'stores/bbs';
import useBBSSearchState from 'components/community/list/useBBSSearchState';
import BoardListItem from '../list/BoardListItem';
import { useObserver } from 'mobx-react';
import MoreButton from 'components/common/MoreButton';

/**
 * 관련글 목록
 *
 *
 */
export default function RelatedArticleList({
  articleId, // 관련글이 표시되는 게시글의 아이디

  // 게시글 진입 전 목록 검색에 사용한 데이터. 게시글에 직접 접근한 경우 아래의 데이터는 없고, 기본값으로 대체된다.
  lastSearchQuery = {}, // 게시글 목록 검색에 사용한 검색 쿼리. bbssearchstore에서 가져옴.
  lastCategoryId, // 게시글 목록의 카테고리 아이디
  lastPage = 1, // 게시글 목록의 페이지 번호
}) {
  const { search: searchStore } = useBBSStore();

  // 페이지 클릭이 이동할 경로. 마지막으로 보고있던 카테고리 목록으로 이동한다
  const bbsListPath = `/community/board/${lastCategoryId}`;

  const { pushRouteToSearch } = useBBSSearchState({
    query: lastSearchQuery,
    asPath: bbsListPath, // 검색시 이동할 경로를 직접 지정
  });

  // `const handleClickPage = useCallback(
  //   (page = 1) => {
  //     pushRouteToSearch(
  //       {
  //         ...lastSearchQuery,
  //         page,
  //       },
  //       {
  //         href: bbsListPath,
  //       }
  //     );
  //   },
  //   [pushRouteToSearch, lastSearchQuery, bbsListPath]
  // );`

  // 쿼리로 검색 실행. 목록 검색에서 사용하는 것과 같은 메소드를 사용함.
  useEffect(() => {
    searchStore.searchWithPost({
      categoryId: lastCategoryId,
      deleted: lastSearchQuery.deleted,
      filterId: lastSearchQuery.filterId,
      inUse: lastSearchQuery.inUse,
      query: lastSearchQuery.query,
      searchType: lastSearchQuery.searchType,
      order: lastSearchQuery.order,
      page: lastSearchQuery.page,
      unitPerPage: lastSearchQuery.unitPerPage,
    });

    return () => {
      // searchQuery 바뀌면 검색 결과 초기화
      searchStore.cleanResults();
    };
  }, []);

  return useObserver(() => (
    <CommunityContentWrap key="list">
      {/* 게시글 목록 */}
      {searchStore.bbsList.map(bbs => {
        return (
          <BoardListItem
            key={bbs.bbsId}
            bbs={bbs}
            wrapperStyle={{
              // 현재 게시글에 하이라이팅 스타일 처리
              background: bbs.bbsId === articleId ? '#f7f8f9' : undefined,
            }}
          />
        );
      })}

      {/* <Pagination
        wrapperStyle={{ marginTop: '62px' }}
        onChangePage={handleClickPage}
        initialPage={parseInt(lastPage, 10)}
        itemsCountPerPage={ITEMS_PER_PAGE}
        totalItemsCount={searchStore.totalCount}
      /> */}

      <MoreButton
        getMoreContent={() => {
          searchStore.moreBBSList();
        }}
      />
    </CommunityContentWrap>
  ));
}
