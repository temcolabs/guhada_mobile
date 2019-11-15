import { observable, action, toJS } from 'mobx';
import { isBrowser } from 'lib/isServer';
import API from 'childs/lib/API';
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
    if (!value?.value) {
      API.settle
        .get(`/event/list?eventProgress=ALL`)
        .then(res => {
          this.eventList = res.data.data;
          this.status.page = true;
        })
        .catch(err => {
          console.log(err, 'event list get error');
          this.eventList = [];
        });
    } else {
      API.settle
        .get(`/event/list?eventProgress=${value.value}`)
        .then(res => {
          this.eventList = [...res.data.data];
          this.status.page = true;
          devLog(toJS(this.eventList), 'event list');
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
