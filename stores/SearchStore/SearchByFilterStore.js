import { observable, action, computed, toJS } from 'mobx';
import API from 'childs/lib/API';
import SearchStore, { ENDPOINT, STATE } from './SearchStore';

// 정렬
export const searchResultOrderMap = new Map([
  ['DATE', '신상품순'],
  ['SCORE', '평점순'],
  ['PRICE_DESC', '높은가격순'],
  ['PRICE_ASC', '낮은가격순'],
  ['DISCOUNT', '할인율순'],
]);
// 배송정보
export const shippingConditionMap = new Map([
  ['NATIONAL', '국내배송'],
  ['INTERNATIONAL', '해외배송'],
]);
// 제품상태
export const productConditionMap = new Map([
  ['NEW', '새제품'],
  ['USED', '빈티지'],
]);

/**
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
 *  searchResultOrder: searchResultOrder
 *  shippingCondition: shippingCondition
 *  productCondition: productCondition
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
    minPrice: '',
    maxPrice: '',
    searchResultOrder: 'DATE',
    productCondition: 'ANY',
    shippingCondition: 'ANY',
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
  defaultParams = {};
  /** @type {Body} default body for iniital request */
  defaultBody = {};

  /**
   * computeds
   */
  @computed get moreToLoad() {
    return this.params.page * this.params.unitPerPage < this.countOfDeals;
  }

  /**
   * actions
   */
  /** @param {boolean} concat flag for creating new `deals` or concat on existing one on executing search - default is false */
  @action search = async (concat = false) => {
    if (this.hasError) {
      console.error('API jammed!'); // TODO: error clearing logic needed
      this.updateState(STATE.LOADABLE);
      return;
    }

    if (this.moreToLoad && this.isLoadable) {
      this.updateState(STATE.LOADING);
      try {
        const {
          data: { data },
        } = await API.search.post(
          `${ENDPOINT.FILTER}?page=${this.params.page}&unitPerPage=${
            this.params.unitPerPage
          }`,
          this.body
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

  /** @param {Params} params */
  @action setAbstractParams = (params = SearchByFilterStore.initialParams) => {
    Object.assign(this.abstractParams, params);
  };
  @action resetAbstractParams = () => {
    this.abstractParams = this.defaultParams;
  };

  /** @param {Body} body */
  @action setAbstractBody = (body = SearchByFilterStore.initialBody) => {
    Object.assign(this.abstractBody, body);
  };
  @action resetAbstractBody = () => {
    this.abstractBody = this.defaultBody;
  };

  @action resetAbstractFilter = () => {
    this.resetAbstractParams();
    this.resetAbstractBody();
  };

  /** apply abstract filter options to concrete filter options then call initial `search` */
  @action submitAbstractFilter = () => {
    this.resetData();
    this.body = this.abstractBody;
    this.params = this.abstractParams;
    this.updateState(STATE.INITIAL);
    this.search();
  };

  /**
   * @param {Body} body initial body
   * @param {Params} params initial params
   */
  @action initializeSearch = (
    body = SearchByFilterStore.initialBody,
    params = SearchByFilterStore.initialParams
  ) => {
    this.defaultBody = body;
    this.defaultParams = params;
    this.resetData();
    Object.assign(this.body, body);
    Object.assign(this.params, params);
    Object.assign(this.abstractBody, body);
    Object.assign(this.abstractParams, params);
    this.updateState(STATE.INITIAL);
    this.search();
  };
}
