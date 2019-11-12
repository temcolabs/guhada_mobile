import { observable, action } from 'mobx';
import { isBrowser } from 'lib/isServer';
import API from 'lib/API';
import { devLog } from 'lib/devLog';

export default class EventMainStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }
  @observable eventList = [];
  @observable status = {
    page: false,
  };

  @action
  getEventList = () => {
    API.settle
      .get(`/event/list`)
      .then(res => {
        devLog(res, 'event list');

        this.eventList = res.data.data;
        this.status.page = true;
      })
      .catch(err => {
        console.log(err, 'event list get error');
        this.eventList = [];
      });
  };
}
