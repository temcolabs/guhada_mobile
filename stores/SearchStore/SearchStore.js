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

class SearchStore {
  /**
   * finite state machine - private
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
  @observable deals = [];
  @observable brands = [];
  @observable categories = [];
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
  /** execute corresponding search method
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
