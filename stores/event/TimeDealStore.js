import { observable, action } from 'mobx';
import API from 'lib/API';
import { isBrowser } from 'lib/common/isServer';

export default class TimeDealStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable timeDeal = [];
  @observable timeDealStatus = false;

  @action
  getTimeDeal = () => {
    this.timeDealStatus = false;
    API.product.get(`/time-deals`).then((res) => {
      this.timeDeal = res.data.data;
      this.timeDealStatus = true;
    });
  };
}
