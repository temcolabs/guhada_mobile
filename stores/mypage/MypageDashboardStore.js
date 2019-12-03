import { observable, action, computed } from 'mobx';
import { isBrowser } from 'childs/lib/common/isServer';
import API from 'childs/lib/API';

export default class MypageDashboardStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  defaultData = {
    deliveryCount: 0,
    couponCount: 0,
    point: 0,
    token: 0,
  };

  @observable
  data = Object.assign({}, this.defaultData);

  @action
  resetData = () => {
    this.data = Object.assign({}, this.defaultData);
  };

  @action
  getDashboard = async () => {
    try {
      const { data } = await API.gateway.get(`/my-page/summary`);
      this.data = Object.assign(this.data, data.data);
    } catch (e) {
      this.resetData();
      console.error(e);
    }
  };
}
