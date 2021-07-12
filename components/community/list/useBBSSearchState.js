import { useState, useEffect, useMemo, useCallback } from 'react';
import { useBBSStore } from 'stores/bbs';
import { compose } from 'lodash/fp';
import { pushRoute } from 'lib/router';
import _ from 'lodash';
import filterObjByKey from 'lib/object/filterObjByKey';
import {
  ITEMS_PER_PAGE,
  MAX_ITEMS_PER_PAGE,
  DEFAULT_ORDER,
  DEFAULT_SEARCH_TYPE,
} from 'lib/constant/community/searchQuery';
import { scrollToTarget } from 'lib/common/scroll';

// 페이지, 카테고리 변경시 스크롤 업할 타겟
export const scrollUpTargetId = 'bbs-scrollup-on-change-page';
export const ALL_CATEGORY_ID = 'all'; // 전체글 게시판 아이디
export const POPULAR_CATEGORY_ID = 'popular'; // 인기글 게시판 아이디

/**
 * 검색에 사용할 파라미터들
 * https://dev.search.guhada.com/ps/swagger-ui.html#/bbs-search-controller/searchUsingPOST
 */
const searchKeys = [
  // searchcriterias
  'categoryId', // 게시판 카테고리.
  'deleted', // 삭제됨 여부
  'filterId', // => categoryFilterId 카테고리 필터
  'inUse', // 사용 여부
  'query', // 검색 입력
  'searchType', // 검색 타입

  // pagination
  'order', // 정렬
  'page', // 현재 페이지
  'unitPerPage', // 페이지당 수
];

// 숫자를 값으로 가지는 파라미터
const keysWithNumber = ['categoryId', 'filterId', 'query'];

const defaultQuery = {
  searchType: DEFAULT_SEARCH_TYPE,
  search: '',
  order: DEFAULT_ORDER,
  page: 1,
  unitPerPage: ITEMS_PER_PAGE,
};

/**
 * 게시글 리스트 검색 상태 관리
 *
 * @param {*} param.router next router
 */
export default function useBBSSearchState({ query, asPath } = {}) {
  const { category: categoryStore } = useBBSStore();

  // 게시판 이름
  const [boardTitle, setBoardTitle] = useState('');

  // 검색에 사용할 쿼리
  const searchQuery = useMemo(
    () =>
      compose(
        (q) =>
          // 기본 쿼리에 덮어씌움
          _.merge({}, defaultQuery, q, {
            // 한번에 가져올 항목 수에는 최대치 제한을 둔다
            unitPerPage: Math.min(
              MAX_ITEMS_PER_PAGE,
              q.unitPerPage || ITEMS_PER_PAGE
            ),
          }),

        // 숫자를 값으로 가져야 하는 키를 처리해준다
        (q) =>
          _.merge(
            q,
            Object.keys(q)
              .filter((key) => keysWithNumber.includes(key))
              .reduce((result, key) => {
                const original = q[key];
                const converted = parseInt(original, 10);
                result[key] = _.isNaN(converted) ? original : converted;
                return result;
              }, {})
          ),

        // 객체에서 검색 API에 사용할 수 있는 키만 필터링한다
        (q) => filterObjByKey(q, searchKeys)
      )(query),
    [query]
  );

  /**
   * 검색 실행. 쿼리 기반으로 라우트를 이동한다.
   *
   * @param options.href 이동할 라우트 경로
   * @param options.initQuery 현재 쿼리를 무시하고 requestQuery만 적용
   */
  const pushRouteToSearch = useCallback(
    (
      requestedQuery = {},
      options = {
        href: null,
        initQuery: false,
      }
    ) => {
      const query = options.initQuery
        ? { ...defaultQuery, ...requestedQuery }
        : {
            page: 1, // 기본 페이지는 1
            ...searchQuery, // 라우트 이동 전의 검색 쿼리
            ...requestedQuery, // 새로운 쿼리 요청
          };

      const targetHref = options.href || asPath;

      pushRoute(targetHref, {
        query,
      });
    },
    [asPath, searchQuery]
  );

  /**
   * 카테고리 필터 선택
   */
  const handleChangeCategoryFilter = useCallback(
    (filterId) => {
      pushRouteToSearch({ filterId, page: 1 });
    },
    [pushRouteToSearch]
  );

  /**
   * 정렬 순서
   */
  const handleChangeOrder = useCallback(
    (order) => {
      if (!_.isNil(order)) {
        pushRouteToSearch({ order, page: 1 });
      }
    },
    [pushRouteToSearch]
  );

  /**
   * 페이지 클릭
   */
  const handleChangePage = useCallback(
    (page = 1) => {
      scrollToTarget(scrollUpTargetId);
      pushRouteToSearch({ page });
    },
    [pushRouteToSearch]
  );

  /**
   * 검색어 입력
   */
  const handleSubmitSearch = useCallback(
    ({ searchType, query }) => {
      scrollToTarget(scrollUpTargetId);
      pushRouteToSearch(
        {
          query,
        },
        {
          href: `/community/board/all`,
        }
      );
    },
    [pushRouteToSearch]
  );

  /**
   * 카테고리(게시판) 선택
   */
  const handleChangeCategory = useCallback(
    (categoryId) => {
      // scrollToTarget(scrollUpTargetId);

      pushRouteToSearch(
        {
          page: 1,
        },
        {
          href: `/community/board/${categoryId}`,
          initQuery: true,
        }
      );
    },
    [pushRouteToSearch]
  );

  const handleSubmitSidebarSearch = useCallback(
    ({ query }) => {
      // TODO: 에디터에서 검색을 실행했을 때 이동하겠냐는 컨펌 표시
      pushRouteToSearch(
        {
          query,
        },
        {
          href: `/community/board/${ALL_CATEGORY_ID}`, // 게시글 목록이 아닌 곳에서도 검색이 가능하기 때문
          initQuery: true,
        }
      );
    },
    [pushRouteToSearch]
  );

  /**
   * 게시판 이름 가져오기. allCategories 배열이 있어야 가져올 수 있다
   */
  useEffect(() => {
    const udpateBoardTitle = () => {
      setBoardTitle(
        categoryStore.getCategoryById(searchQuery.categoryId)?.name
      );
    };

    categoryStore.pushJobForCategory(udpateBoardTitle);
  }, [categoryStore, searchQuery.categoryId]);

  return {
    searchQuery,
    boardTitle,
    pushRouteToSearch,
    handleChangeCategory,
    handleChangeCategoryFilter,
    handleChangeOrder,
    handleChangePage,
    handleSubmitSearch,
    handleSubmitSidebarSearch,
    scrollUpTargetId,
    ALL_CATEGORY_ID,
    POPULAR_CATEGORY_ID,
  };
}
