import { observable, action, computed, toJS } from 'mobx';
import API from 'lib/API';
import _ from 'lodash';
import { getEscapedBody } from 'lib/common/getEscapedBody';
import SearchStore, { ENDPOINT, STATE } from './SearchStore';

/** body props to compare with `defaultBody` to check if initializing is needed */
const defaultComparedBodyProps = [
  'categoryIds',
  'brandIds',
  'searchQueries',
  'searchCondition',
];

/** 종류 */
export const searchConditionMap = new Map([
  ['PLUS', 'PREMIUM ITEM'],
  ['BEST', 'BEST ITEM'],
  ['NEW', 'NEW IN'],
]);
export const searchConditions = ['PLUS', 'BEST', 'NEW'];
/** 정렬 */
export const searchResultOrderMap = new Map([
  ['DATE', '신상품순'],
  ['SCORE', '평점순'],
  ['PRICE_DESC', '높은가격순'],
  ['PRICE_ASC', '낮은가격순'],
  ['DISCOUNT', '할인율순'],
]);
/** 배송정보 */
export const shippingConditionMap = new Map([
  ['NATIONAL', '국내배송'],
  ['INTERNATIONAL', '해외배송'],
]);
/** 제품상태 */
export const productConditionMap = new Map([
  ['NEW', '새제품'],
  ['USED', '빈티지'],
]);
/** 가격 범위 */
export const priceArrangeMap = new Map([
  ['전체', 0],
  ['10만원 이하', 100000],
  ['30만원 이하', 300000],
  ['50만원 이하', 500000],
  ['100만원 이하', 1000000],
]);

/**
 * JSDoc typedefs
 *
 * @typedef {{
 *  page: number
 *  unitPerPage: number
 * }} Params request params
 *
 * @typedef {{
 *  brandIds: number[]
 *  categoryIds: number[]
 *  eventIds: number[]
 *  sellerIds: number[]
 *  filters: string[]
 *  searchQueries: string[]
 *  minPrice: string|number
 *  maxPrice: string|number
 *  searchResultOrder: searchResultOrderMap
 *  shippingCondition: shippingConditionMap
 *  productCondition: productConditionMap
 *  searchCondition: searchConditionMap
 * }} Body request body
 */

export class SearchByFilterStore extends SearchStore {
  /**
   * statics
   */
  static initialParams = {
    page: 1,
    unitPerPage: 24,
  };
  static initialBody = {
    brandIds: [],
    categoryIds: [],
    eventIds: [],
    sellerIds: [],
    filters: [],
    searchQueries: [],
    minPrice: 0,
    maxPrice: 0,
    searchResultOrder: 'DATE',
    shippingCondition: 'ANY',
    productCondition: 'ANY',
  };

  /**
   * observables
   */
  /** @type {Params} params before submission */
  @observable abstractParams = SearchByFilterStore.initialParams;
  /** @type {Body} body before submission */
  @observable abstractBody = SearchByFilterStore.initialBody;

  // request payload
  /** @type {Params} concrete params for actual request */
  @observable params = SearchByFilterStore.initialParams;
  /** @type {Body} concrete body for actual request */
  @observable body = SearchByFilterStore.initialBody;

  /** @type {Params} default params for initial request */
  @observable defaultParams = SearchByFilterStore.initialParams;
  /** @type {Body} default body for iniital request */
  @observable defaultBody = SearchByFilterStore.initialBody;

  /**
   * computeds
   */
  /** Check if there are more resource to search for */
  @computed get moreToLoad() {
    return this.params.page * this.params.unitPerPage < this.countOfDeals;
  }

  /** Check if search result is filtered (without searchResultorder) */
  @computed get isFiltered() {
    const { searchResultOrder: s, ...copiedBody } = toJS(this.body);
    const { searchResultOrder, ...copiedDefaultBody } = toJS(this.defaultBody);
    return !_.isEqual(copiedBody, copiedDefaultBody);
  }

  /**
   * actions
   */
  /** @param {boolean} concat flag for creating new `deals` or concat on existing one on executing search - default = false */
  @action search = async (concat = false) => {
    if (this.hasError) {
      console.error('API jammed!'); // TODO: error clearing logic needed
      this.cancelTokenSource.cancel();
      this.root.alert.showAlert('검색 오류! 다시 시도해주세요.');
      this.updateState(STATE.LOADABLE);
      return;
    }

    if (this.moreToLoad && this.isLoadable) {
      this.updateState(STATE.LOADING);
      try {
        const {
          data: { data },
        } = await API.search.post(
          `${ENDPOINT.FILTER}?page=${this.params.page}&unitPerPage=${this.params.unitPerPage}`,
          this.body
          // { cancelToken: this.cancelTokenSource.token }
        );

        this.deals = concat ? this.deals.concat(data.deals) : data.deals;

        if (this.params.page === 1 || this.countOfDeals === Infinity) {
          this.countOfDeals = data.countOfDeals;
          this.brands = data.brands;
          this.categories = data.categories;
          this.filters = data.filters;
        }
        this.params.page++;

        if (this.moreToLoad) {
          this.updateState(STATE.LOADABLE);
        } else {
          this.updateState(STATE.LOADED);
        }
      } catch (error) {
        console.error(error.message);
        this.updateState(STATE.ERROR);
      }
    }
  };

  /**
   * apply abstract filter options (does not call search)
   * @param {Body} body default = this.defaultBody
   * @param {Params} params default = this.defaultParams
   */
  @action setAbstractFilter = (
    body = this.defaultBody,
    params = this.defaultParams
  ) => {
    Object.assign(this.abstractParams, params);
    Object.assign(this.abstractBody, body);
  };

  /** reset current abstract filter options (does not call search) */
  @action resetAbstractFilter = () => this.setAbstractFilter();

  /**
   * apply abstract filter options to concrete filter options indirectly
   * then call initial `search`
   */
  @action submitAbstractFilter = () => {
    this.resetData();
    Object.assign(this.body, this.abstractBody);
    Object.assign(this.params, this.abstractParams);
    this.updateState(STATE.LOADABLE);
    this.search();
  };

  /**
   * apply filter options to concrete filter options directly
   * then call initial `search`
   * @param {Body} body default = this.defaultBody
   * @param {Params} params default = this.defaultParams
   */
  @action submitFilter = (
    body = this.defaultBody,
    params = this.defaultParams
  ) => {
    this.resetData();
    Object.assign(this.body, body);
    Object.assign(this.params, params);
    Object.assign(this.abstractBody, body);
    Object.assign(this.abstractParams, params);
    this.updateState(STATE.LOADABLE);
    this.search();
  };
  /** apply default filter options and call search */
  @action resetFilter = () => this.submitFilter();

  /**
   * reset specific body property(s) and call search
   * @param args Body object property(s)
   */
  @action resetBodyProp = (...args) => {
    this.resetData();
    args.forEach((prop) => {
      Object.assign(this.body, { [prop]: this.defaultBody[prop] });
      Object.assign(this.abstractBody, { [prop]: this.defaultBody[prop] });
    });
    Object.assign(this.params, this.defaultParams);
    Object.assign(this.abstractParams, this.defaultParams);
    this.updateState(STATE.LOADABLE);
    this.search();
  };

  /**
   * @param {Body} body initial body - default = SearchByFilterStore.initialBody
   * @param {Params} params initial params - default = SearchByFilterStore.initialParams
   * @param {boolean} resetUnfungibles flag to reset unfungible datas - default = true
   */
  @action initializeSearch = (
    body = SearchByFilterStore.initialBody,
    params = SearchByFilterStore.initialParams,
    resetUnfungibles = true
  ) => {
    this.resetData();

    getEscapedBody(body);

    this.defaultBody = SearchByFilterStore.initialBody;
    this.defaultParams = SearchByFilterStore.initialParams;
    this.body = SearchByFilterStore.initialBody;
    this.params = SearchByFilterStore.initialParams;
    this.abstractBody = SearchByFilterStore.initialBody;
    this.abstractParams = SearchByFilterStore.initialParams;

    Object.assign(this.defaultBody, body);
    Object.assign(this.defaultParams, params);
    Object.assign(this.body, body);
    Object.assign(this.params, params);
    Object.assign(this.abstractBody, body);
    Object.assign(this.abstractParams, params);
    this.updateState(STATE.LOADABLE);

    this.search().then(() => {
      if (resetUnfungibles) {
        this.unfungibleCategories = toJS(this.categories);
        this.unfungibleBrands = toJS(this.brands);
      }
    });
  };

  /**
   * DANGER: `initializeSearch` is more preferable than this
   *
   * fetch search results from query params - no need to `initializeSearch` if this is called
   * @param {object} query
   */
  @action fetchSearchResults = (query = {}) => {
    const {
      category,
      subcategory,
      brand,
      keyword,
      page,
      unitPerPage,
      condition,
    } = query;

    const categoryIds = [];
    const brandIds = [];
    const searchQueries = [];

    const body = { categoryIds, brandIds, searchQueries };

    if (category) {
      categoryIds.push(...category.split(',').map(Number));
    }
    if (subcategory) {
      categoryIds.push(...subcategory.split(',').map(Number));
    }
    if (brand) {
      brandIds.push(...brand.split(','));
    }
    if (keyword) {
      searchQueries.push(...keyword.split(','));
    }
    if (searchConditions.includes(condition)) {
      body.searchCondition = condition;
    }

    const params = { page: page || 1, unitPerPage: unitPerPage || 24 };

    this.initializeSearch(body, params, true);
  };

  /**
   * SEARCH PAGE RELATED OBSERVABLES
   */
  /** @param {object} query  */
  @action initializePage(query) {
    const state = Object.assign(window.history.state, { query });
    this.root.layout.handlePushState.default(state, true);
  }
}
