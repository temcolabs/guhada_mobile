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

    if (initialState.newMain) {
      if (initialState.newMain.mainData) {
        this.mainData = initialState.newMain.mainData;
        this.initial.mainData = false;
      }
    }
  }

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
  /** @param {string} type */
  @action setPageType(type) {
    this.pageType = pageTypes[type];
  }

  @action initialize() {
    if (this.loadable) {
      services.map((service) =>
        API_ENDPOINT[service].map(([dataName, endpoint]) =>
          this.fetchData(service, endpoint, dataName)
        )
      );
    }
  }

  /**
   * @param {string} service
   * @param {string} dataName
   * @param {string} endpoint
   */
  fetchData = async (service, endpoint, dataName) => {
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
    return;
  };

  /**
   * statics
   */
  static initializeStatic = async () => {
    try {
      const { data } = await new Promise((res) => {
        const timer = setTimeout(() => res({ data: {} }), 500);
        API.settle
          .get('/selectMainData?agent=MWEB')
          .then((data) => {
            clearTimeout(timer);
            res(data);
          })
          .catch(() => {
            clearTimeout(timer);
            res({ data: {} });
          });
      });
      if (data && data.resultCode === 200) {
        return { mainData: data.data };
      }
    } catch (error) {
      // console.error(error.mesasage);
    }
    return {};

    // const initialData = {}
    // await Promise.all(
    //   services.map(async (service) => {
    //     return await Promise.all(
    //       API_ENDPOINT[service].map(([dataName, endpoint]) =>
    //         MainStore.fetchDataStatic(service, endpoint, dataName, iniitialData)
    //       )
    //     );
    //   })
    // );
    // return iniitialData;
  };

  /**
   * @param {string} service
   * @param {string} endpoint
   * @param {string} dataName
   * @param {object} dataObject
   */
  static fetchDataStatic = async (service, endpoint, dataName, dataObject) => {
    try {
      const { data } = await API[service].get(endpoint);

      if (data.resultCode === 200) {
        dataObject[dataName] = data.data;
      }
    } catch (error) {
      // console.error(dataName, error.message);
    }
    return;
  };
}

export default MainStore;
