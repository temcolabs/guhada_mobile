import { observable, action, computed } from 'mobx';
import API from 'lib/API';
import SearchStore, { ENDPOINT, STATE } from './SearchStore';

// 정렬
export const searchResultOrder = {
  DATE: 'DATE', // 신상품순
  SCORE: 'SCORE', // 평점순
  DISCOUNT: 'DISCOUNT', // 할인율순
  PRICE_DESC: 'PRICE_DESC', // 높은가격순
  PRICE_ASC: 'PRICE_ASC', // 낮은가격순
};
// 배송정보
export const shippingCondition = {
  NATIONAL: 'NATIONAL', // 국내배송
  INTERNATIONAL: 'INTERNATIONAL', // 해외배송
};
// 제품상태
export const productCondition = {
  NEW: 'NEW', // 새제품
  USED: 'USED', // 빈티지
};

/**
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
 * }} filter
 *
 * @typedef {{
 *  currentPage: number
 *  unitPerPage: number
 * }} params
 */

export class SearchByAllStore extends SearchStore {
  /**
   * statics
   */
  static initialFilter = {
    brandIds: [100755],
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

  static initialParams = {
    currentPage: 1,
    unitPerPage: 20,
  };

  /**
   * observables
   */
  /** @type {filter} */
  @observable filter = SearchByAllStore.initialFilter;
  /** @type {params} */
  @observable params = SearchByAllStore.initialParams;
  @observable deals = [];
  @observable countOfDeals = Infinity;

  /**
   * computeds
   */
  @computed get moreToLoad() {
    return (
      this.params.currentPage * this.params.unitPerPage < this.countOfDeals
    );
  }

  /**
   * actions
   */
  /** @param {boolean} concat flag for creating new `deals` or concat on existing one on executing search - default is false*/
  @action searchByFilter = async (concat = false) => {
    if (this.hasError) {
      console.error('API jammed!'); // TODO: error clearing logic needed
      this.updateState(STATE.LOADABLE);
      return;
    }

    if (this.isLoadable && this.moreToLoad) {
      this.updateState(STATE.LOADING);
      try {
        const {
          data: { data },
        } = await API.search.post(
          `${ENDPOINT.FILTER}?page=${this.params.currentPage}&unitPerPage=${this.params.unitPerPage}`,
          this.filter
        );

        if (this.countOfDeals !== data.countOfDeals) {
          this.countOfDeals = data.countOfDeals;
        }

        this.params.currentPage++;
        this.deals = this.deals.concat(data.deals);

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

  /** @param {params} params */
  @action setParams = (params = SearchByAllStore.initialParams) => {
    Object.assign(this.params, params);
  };
  @action resetParams = () => {
    this.params = SearchByAllStore.initialParams;
    this.updateState(STATE.INITIAL);
  };

  /** @param {filter} filter */
  @action setFilter = (filter = SearchByAllStore.initialFilter) => {
    Object.assign(this.filter, filter);
  };
  @action resetFilter = () => {
    this.filter = SearchByAllStore.initialFilter;
    this.updateState(STATE.INITIAL);
  };
}
