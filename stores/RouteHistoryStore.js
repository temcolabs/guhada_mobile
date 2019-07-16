import { observable, action } from 'mobx';
import Router from 'next/router';
import sessionStorage from 'lib/sessionStorage';

export default class RouteHistoryStore {
  @observable urls = [];

  constructor() {
    this.routeChangeStart();
  }

  @action
  routeChangeStart = () => {
    Router.events.on('routeChangeStart', url => {
      let prevUrl = sessionStorage.get('prevUrl');
      let thisUrl = sessionStorage.get('thisUrl');
      if (prevUrl === thisUrl) {
        sessionStorage.set('thisUrl', url);
      } else if (prevUrl !== thisUrl) {
        sessionStorage.set('prevUrl', sessionStorage.get('thisUrl'));
        sessionStorage.set('thisUrl', url);
      }
    });
  };
}
