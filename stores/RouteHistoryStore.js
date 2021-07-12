import { observable, action } from 'mobx';
import Router from 'next/router';
import sessionStorage from 'lib/common/sessionStorage';

export default class RouteHistoryStore {
  @observable urls = [];

  constructor() {
    this.routeChangeStart();
  }

  @action
  routeChangeStart = () => {
    Router.events.on('routeChangeStart', (url) => {
      sessionStorage.set('urlHistory', url);
    });
  };
}
