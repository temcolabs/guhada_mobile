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
  @observable eventDetail = {};
  @observable status = {
    page: false,
    detailPage: false,
  };

  @action
  getEventList = value => {
    if (!value) {
      API.settle
        .get(`/event/list?eventProgress=`)
        .then(res => {
          devLog(res, 'event list');

          this.eventList = res.data.data;
          this.status.page = true;
        })
        .catch(err => {
          console.log(err, 'event list get error');
          this.eventList = [];
        });
    }
  };

  @action
  getEventDetail = id => {
    API.settle
      .get(`/event/list/detail`, {
        params: {
          eventId: id,
        },
      })
      .then(res => {
        this.eventDetail = res.data.data;
        devLog(this.eventDetail, 'event detail');
        this.getUrl();
        this.status.detailPage = true;
      })
      .catch(err => {
        console.log(err, 'event detail get error');
        this.eventDetail = {};
      });
  };

  getUrl = () => {
    let url = this.eventDetail.detailPageLink;
    let start = url.indexOf('com');
    let query = url.substr(start + 3);
    this.eventDetail.detailPageLink = query;
  };
}
