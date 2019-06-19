import { observable } from 'mobx';

export default class UiStatus {
  @observable currentUrl = window.location.href;
  @observable productUrl = 'http://13.125.32.38:8080';
}
