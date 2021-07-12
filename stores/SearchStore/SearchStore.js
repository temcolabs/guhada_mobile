import { observable, computed, action } from 'mobx';
import { isBrowser } from 'lib/common/isServer';
import { CancelToken } from 'axios';

/** API endpoint enum */
export const ENDPOINT = {
  ALL: '/ps/search/all',
  FILTER: '/ps/search/filter',
  COUNTS: '/ps/search/counts',
  BRANDS: '/ps/search/brands',
  SELLER_RELATED: '/ps/search/seller/related',
  SELLER_POPULAR: '/ps/search/seller/popular',
  AUTOCOMPLETE: '/ps/search/autocomplete',
};

/** state enum */
export const STATE = {
  INITIAL: 'INITIAL',
  LOADING: 'LOADING',
  LOADABLE: 'LOADABLE',
  LOADED: 'LOADED',
  ERROR: 'ERROR',
};

/** display thumbnail enum */
export const THUMBNAIL = {
  HORIZONTAL: -1,
  QUAD: 0,
  DOUBLE: 1,
  HEX: 2,
};

/**
 * JSDoc typedefs
 *
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
   * @private singleton state
   */
  @observable _state = STATE.INITIAL;
  @computed get state() {
    return SearchStore.instance._state;
  }

  /**
   * Updates current store's state
   * @param {STATE} state
   */
  @action updateState(state) {
    SearchStore.instance._state = state;
  }
  @computed get isInitial() {
    return (
      this.countOfDeals === Infinity ||
      SearchStore.instance._state === STATE.INITIAL
    );
  }
  @computed get isLoading() {
    return SearchStore.instance._state === STATE.LOADING;
  }
  @computed get isLoadable() {
    return SearchStore.instance._state === STATE.LOADABLE;
  }
  @computed get hasError() {
    return SearchStore.instance._state === STATE.ERROR;
  }

  /** singleton instance for shared FSM state */
  static instance;
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
    if (!SearchStore.instance) {
      SearchStore.instance = this;
    }
    this.cancelTokenSource = CancelToken.source();
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
  /** @type {Brand[]} brands list from initial search */
  @observable unfungibleBrands = [];
  /** @type {Category[]} */
  @observable categories = [];
  /** @type {Category[]} categories list from initial search */
  @observable unfungibleCategories = [];
  /** @type {Filter[]} */
  @observable filters = [];

  /** deal items thumbnail display */
  @observable thumbnail = THUMBNAIL.QUAD;

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

  /** WARNING - resets unfungible data */
  @action resetUnfungibles() {
    this.unfungibleCategories = [];
    this.unfungibleBrands = [];
  }

  /**
   * abstract methods
   */
  /**
   * the actual executor for bound search endpoint
   * @abstract
   */
  search = () => {
    console.error('not allowed');
  };

  /**
   * need to call this method first in order to seemlessly start searching
   * @abstract
   */
  initializeSearch = () => {
    console.error('not allowed');
  };
}

export default SearchStore;
