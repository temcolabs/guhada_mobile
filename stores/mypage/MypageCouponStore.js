import { observable, action, toJS } from 'mobx';
import API from 'lib/API';
import { isBrowser } from 'lib/isServer';
const isServer = typeof window === 'undefined';

export default class MypageCouponStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable activeTab = true;
  @observable itemsCountPerPage = 10;
  @observable totalItemsCount = 0;
  @observable page = 1;
  @action
  changeActiveTab = () => {
    this.activeTab = !this.activeTab;
  };
}
