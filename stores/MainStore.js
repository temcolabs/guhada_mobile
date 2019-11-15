import { computed, observable, action, toJS } from 'mobx';
import API from 'childs/lib/API';
import { isBrowser } from 'lib/isServer';

const isServer = typeof window === 'undefined';

export default class MainStore {
  @observable unitPerPage = 6;
  @observable plusItem = [];
  @observable newArrivals = [];
  @observable hits = [];
  @observable navDealId = 0;
  @observable hotKeyword = [];
  @observable timeDeal = [];
  @observable timeDealStatus = false;

  constructor() {
    this.getPlusItem();
    this.getNewArrivals();
    this.getHits();
    this.getHotKeyword();
    this.getTimeDeal();
  }

  @action
  setNavDealId = id => {
    this.navDealId = id;
  };
  @action
  getPlusItem = () => {
    API.search
      .get('/ps/main-home/deals/plus-item', {
        params: {
          unitPerPage: this.unitPerPage,
        },
      })
      .then(res => {
        if (res.data.resultCode === 200) {
          this.plusItem = res.data.data;
        }
      });
  };

  @action
  getNewArrivals = () => {
    API.search
      .get('/ps/main-home/deals/new-arrivals', {
        params: {
          unitPerPage: this.unitPerPage,
        },
      })
      .then(res => {
        if (res.data.resultCode === 200) {
          this.newArrivals = res.data.data;
        }
      });
  };

  @action
  getHits = () => {
    API.search
      .get('/ps/hits/list', {
        params: {
          unitPerPage: this.unitPerPage,
        },
      })
      .then(res => {
        if (res.data.resultCode === 200) {
          this.hits = res.data.data;
        }
      });
  };

  @action
  getHotKeyword = () => {
    API.product.get('/main-home/hot-keyword', {}).then(res => {
      this.hotKeyword = res.data.data;
    });
  };

  @action
  getTimeDeal = () => {
    this.timeDealStatus = false;
    API.product.get(`/time-deals`).then(res => {
      this.timeDeal = res.data.data;
      this.timeDealStatus = true;
    });
  };
}
