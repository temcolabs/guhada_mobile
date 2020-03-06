import { computed, observable, action, toJS } from 'mobx';
import API from 'childs/lib/API';

export default class MainStore {
  @observable unitPerPage = 60;
  @observable plusItem = [];
  @observable newArrivals = [];
  @observable hits = [];
  @observable navDealId = 0;
  @observable hotKeyword = [];
  @observable bannerInfo = [];
  @observable bestReview = [];
  // constructor() {
  //   this.getPlusItem();
  //   this.getNewArrivals();
  //   this.getHits();
  //   this.getHotKeyword();
  //   this.getMainBannner();
  //   this.getBestReview();
  // }

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
  getMainBannner = () => {
    API.settle.get(`selectMainBanner`).then(res => {
      this.bannerInfo = res.data;
    });
  };

  @action
  getBestReview = () => {
    API.user
      .get(`/main-best-reviews`, { params: { unitPerPage: 5 } })
      .then(res => {
        this.bestReview = res.data.data;
      });
  };
}
