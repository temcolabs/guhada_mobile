import { observable, action, computed } from 'mobx';
import { isBrowser } from 'childs/lib/common/isServer';
import API from 'childs/lib/API';
import { pageTypes, services, dataNames, API_ENDPOINT } from './constants';
export * from './constants';

class MainStore {
  constructor(root, initialState) {
    if (isBrowser) {
      this.root = root;
    }

    if (initialState.main) {
    }
  }

  /**
   * statics
   */

  /**
   * observables
   */
  @observable pageType = pageTypes.index;
  @observable initial = {
    /* search */
    premiumItem: true,
    bestItem: true,
    newIn: true,
    /* settle */
    mainData: true,
    /* product */
    hotKeyword: true,
    /* user */
    bestReview: true,
  };

  @observable premiumItem = {
    ALL: [],
    WOMEN: [],
    MEN: [],
    KIDS: [],
  };
  @observable bestItem = {
    ALL: [],
    WOMEN: [],
    MEN: [],
    KIDS: [],
  };
  @observable newIn = {
    ALL: [],
    WOMEN: [],
    MEN: [],
    KIDS: [],
  };
  @observable hotKeyword = [];
  @observable bestReview = [];
  @observable mainData = {
    mainBannerList: [],
    mainImageSetOneSetList: [],
    mainImageSetTwoSetList: [],
    mainImageSetThreeList: [],
    mainImageSetFourList: [],
    placeholder: '',
    placeholderLink: '',
    placeholderLinkMobile: '',
  };

  /**
   * computeds
   */
  @computed get loadable() {
    return !!dataNames.find((name) => this.initial[name]);
  }

  /**
   * actions
   */
  @action setPageType(type) {
    this.pageType = pageTypes[type];
  }

  @action initialize() {
    if (this.loadable) {
      services.map((service) =>
        API_ENDPOINT[service].map(([dataName, endpoint]) =>
          this.fetchData(service, dataName, endpoint)
        )
      );
    }
  }

  fetchData = async (service, dataName, endpoint) => {
    if (this.initial[dataName]) {
      try {
        const { data } = await API[service].get(endpoint);

        if (data.resultCode === 200) {
          this[dataName] = data.data;
          this.initial[dataName] = false;
        }
      } catch (error) {
        console.error(dataName, error.message);
      }
    }
  };
}

export default MainStore;
