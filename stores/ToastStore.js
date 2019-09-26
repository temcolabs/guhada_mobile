import { observable, action, toJS } from 'mobx';
import { isBrowser } from 'lib/isServer';

export default class ToastStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable error;
  @observable status = false;

  @action
  getToast = error => {
    this.error = error;
    this.status = true;
    setTimeout(() => this.setStatus(false), 2000);
  };

  @action
  setStatus = bool => {
    this.status = bool;
  };
}
