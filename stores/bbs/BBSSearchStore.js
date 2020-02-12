import { observable, action, toJS } from 'mobx';
import { isBrowser } from 'childs/lib/common/isServer';
import API from 'childs/lib/API';
import _ from 'lodash';
import searchOrder from 'childs/lib/constant/community/searchOrder';
import filterByKey from 'childs/lib/object/filterObjByKey';
import { ITEMS_PER_PAGE } from 'childs/lib/constant/community/searchQuery';
import { devLog, devGroup, devGroupEnd } from 'childs/lib/common/devLog';
import { POPULAR_CATEGORY_ID } from 'components/community/list/useBBSSearchState';

const DIFF_DAY_IN_MS = 1000 * 60 * 60 * 24;

export default class SearchStore {
  constructor(root, initialData = {}) {
    if (isBrowser) {
      this.root = root;
    }
  }

  /**
   * 게시글 목록에서 사용하는 검색 결과
   */
  @observable
  bbsList = [];

  @observable
  relatedBbsList = [];

  @observable
  isFetching = false;

  @observable
  totalCount = 0;

  @observable
  searchQuery = {};

  @action
  cleanResults = () => {
    this.bbsList = [];
  };

  /**
   * 서버의 검색 결과에 값을 일부 업데이트한다
   */
  @action
  mapBBSList = (list = []) => {
    return list.map(bbs =>
      _.merge(bbs, {
        // 신규 글 여부
        newlyCreated: this.getIsNewlyCreated({
          now: bbs.now,
          created: bbs.date,
        }),
      })
    );
  };

  /**
   * GET /bbs/search
   */
  @action
  searchWithGet = async searchQuery => {
    if (_.isNil(searchQuery.query)) {
      console.error('검색어를 입력해야 합니다.');
    } else {
      this.searchQuery = searchQuery;

      const availableParams = ['order', 'page', 'query', 'unitPerPage'];

      try {
        this.isFetching = true;
        const { data } = await API.bbsSearch.get(`/bbs/search`, {
          params: filterByKey(searchQuery, availableParams),
        });

        this.bbsList = this.mapBBSList(data.data?.bbs) || [];
        this.totalCount = data.data?.totalCount;
      } catch (e) {
        console.error(e);
      } finally {
        this.isFetching = false;
      }
    }
  };

  /**
   * POST /bbs/search
   */
  @action
  searchWithPost = async (searchQuery = {}) => {
    devGroup(`searchWithPost`);
    this.searchQuery = searchQuery;
    devLog(`searchQuery`, searchQuery);

    const filterUnvalid = _.partialRight(
      _.omitBy,
      v => _.isNil(v) || _.isNaN(v) || v === ''
    );

    const searchBody = filterUnvalid({
      categoryId: parseInt(searchQuery.categoryId, 10),
      filterId: parseInt(searchQuery.filterId, 10),
      deleted: searchQuery.deleted,
      inUse: searchQuery.inUse,
      query: searchQuery.query,
      searchType: searchQuery.searchType,
    });

    const pageQuery = {
      order:
        // 인기글 카테고리는 order가 고정이다. 인기글 검색은 카테고리 아이디가 아닌 ORDER로 하기 때문
        searchQuery.categoryId === POPULAR_CATEGORY_ID
          ? searchOrder.POPULARITY
          : searchQuery.order || searchOrder.DATE_DESC,
      page: parseInt(searchQuery.page, 10) || 1,
      unitPerPage: parseInt(searchQuery.unitPerPage, 10) || ITEMS_PER_PAGE,
    };

    devLog('searchBody, pageQuery', searchBody, pageQuery);

    try {
      this.isFetching = true;
      const { data } = await API.bbsSearch.post(`/bbs/search?`, searchBody, {
        params: pageQuery,
      });
      this.bbsList = this.mapBBSList(data.data?.bbs) || [];
      this.totalCount = data.data?.totalCount;
    } catch (e) {
      console.error(e);
    } finally {
      this.isFetching = false;
      devGroupEnd(`searchWithPost`);
    }
  };

  /**
   * POST /bbs/search
   */
  @action
  moreBBSList = async () => {
    devGroup(`moreBBSList`);
    if (this.searchQuery.page) {
      this.searchQuery.page = parseInt(this.searchQuery.page) + 1;
    } else {
      this.searchQuery.page = 1;
    }
    devLog(` this.searchQuery `, this.searchQuery);

    const filterUnvalid = _.partialRight(
      _.omitBy,
      v => _.isNil(v) || _.isNaN(v) || v === ''
    );

    const searchBody = filterUnvalid({
      categoryId: parseInt(this.searchQuery.categoryId, 10),
      filterId: parseInt(this.searchQuery.filterId, 10),
      deleted: this.searchQuery.deleted,
      inUse: this.searchQuery.inUse,
      query: this.searchQuery.query,
      searchType: this.searchQuery.searchType,
    });

    const pageQuery = {
      order:
        // 인기글 카테고리는 order가 고정이다. 인기글 검색은 카테고리 아이디가 아닌 ORDER로 하기 때문
        this.searchQuery.categoryId === POPULAR_CATEGORY_ID
          ? searchOrder.POPULARITY
          : this.searchQuery.order || searchOrder.DATE_DESC,
      page: parseInt(this.searchQuery.page, 10) || 1,
      unitPerPage: parseInt(this.searchQuery.unitPerPage, 10) || ITEMS_PER_PAGE,
    };

    try {
      this.isFetching = true;
      const { data } = await API.bbsSearch.post(`/bbs/search?`, searchBody, {
        params: pageQuery,
      });
      this.bbsList = this.bbsList.concat(this.mapBBSList(data.data?.bbs) || []);
      this.totalCount = data.data?.totalCount;
    } catch (e) {
      console.error(e);
    } finally {
      this.isFetching = false;
      devGroupEnd(`searchWithPost`);
    }
  };

  /**
   * 신규 글인지 확인
   * 24시간 이내 작성된 글이라면 true
   */
  getIsNewlyCreated = ({ now, created }) => {
    const diffInMs = +new Date(now) - +new Date(created);
    return diffInMs < DIFF_DAY_IN_MS ? true : false;
  };
}
