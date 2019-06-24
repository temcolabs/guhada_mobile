import { observable, action, toJS } from 'mobx';

export default class ToastStore {
  @observable error;
  @observable status = false;

  @action
  getToast = error => {
    this.error = error;
    this.status = true;
    setTimeout(() => this.setStatus(false), 3000);
  };

  @action
  setStatus = bool => {
    this.status = bool;
  };
}
