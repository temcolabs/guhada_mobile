import { observable, computed, action } from 'mobx';

export const ENDPOINT = {
  ALL: '/ps/search/all',
  FILTER: '/ps/search/filter',
  COUNTS: '/ps/search/counts',
  BRANDS: '/ps/search/brands',
  SELLER_RELATED: '/ps/search/seller/related',
  SELLER_POPULAR: '/ps/search/seller/popular',
  AUTOCOMPLETE: '/ps/search/autocomplete',
};

export const STATE = {
  INITIAL: 'INITIAL',
  LOADING: 'LOADING',
  LOADABLE: 'LOADABLE',
  LOADED: 'LOADED',
  ERROR: 'ERROR',
};

/**
 * @typedef {{
 *  brandId: number
 *  brandName: string
 *  sellerId: number
 *  sellerName: string
 *  productId: number
 *  productName: string
 *  productSeason: string
 *  productImage: {
 *    name: string
 *    url: string
 *    width: number
 *    height: number
 *  }
 *  dealId: number
 *  dealName: string
 *  sellPrice: number
 *  discountPrice: number
 *  setDiscount: boolean
 *  categoryId: number
 *  freeShipping: boolean
 *  options: object[]
 *  discountRate: number
 *  isBoldName: boolean
 *  internationalShipping: boolean
 *  brandNew: boolean
 *  soldOut: boolean
 * }} Deal deal object
 *
 * @typedef {{
 *  id: number
 *  isFavorite: boolean
 *  nameDefault: string
 *  nameEn: string
 *  nameKo: string
 * }} Brand brand object
 *
 * @typedef {{
 * }} Category category object
 *
 * @typedef {{
 * }} Filter filter object
 */

class SearchStore {
  /**
   * finite state machine
   * @private
   */
  @observable _state = STATE.INITIAL; // singleton state
  @computed get state() {
    return SearchStore.instance._state;
  }

  /** @param {STATE} state */
  @action updateState(state) {
    SearchStore.instance._state = state;
  }
  get isLoading() {
    return SearchStore.instance._state === STATE.LOADING;
  }
  get isLoadable() {
    return (
      SearchStore.instance._state === STATE.INITIAL ||
      SearchStore.instance._state === STATE.LOADABLE
    );
  }
  get hasError() {
    return SearchStore.instance._state === STATE.ERROR;
  }

  static instance; // singleton instance for shared FSM state
  constructor() {
    if (!SearchStore.instance) {
      SearchStore.instance = this;
    }
  }

  /**
   * observables
   */
  // response payload
  @observable countOfDeals = Infinity;
  /** @type {Deal[]} */
  @observable deals = [];
  /** @type {Brand[]} */
  @observable brands = [];
  /** @type {Category[]} */
  @observable categories = [];
  /** @type {Category[]} */
  @observable unfungibleCategories = []; // categories object from initial search
  /** @type {Filter[]} */
  @observable filters = [];

  /**
   * actions
   */
  /** resets request payload data */
  @action resetData() {
    this.countOfDeals = Infinity;
    this.deals = [];
    this.brands = [];
    this.categories = [];
    this.filters = [];
  }

  /**
   * abstract methods
   */
  /** execute bound search method
   * @abstract
   */
  search = () => {
    console.error('not allowed');
  };

  /**
   * need to call this method in order to seemlessly start searching
   * @abstract
   * */
  initializeSearch = () => {
    console.error('not allowed');
  };
}

export default SearchStore;
