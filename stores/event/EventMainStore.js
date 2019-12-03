import { observable, action, toJS } from 'mobx';
import { isBrowser } from 'childs/lib/common/isServer';
import API from 'childs/lib/API';
import { devLog } from 'childs/lib/common/devLog';
import { isIOS, isAndroid } from 'childs/lib/common/detectMobileEnv';
import moment from 'moment';
export default class EventMainStore {
  constructor(root, initialState) {
    if (isBrowser) {
      this.root = root;
    }

    // 이벤트 상세 데이터
    if (initialState.eventmain?.eventDetail) {
      this.eventDetail = initialState.eventmain?.eventDetail;
    }
  }
  @observable eventList = [];
  @observable eventDetail = {};
  @observable status = {
    page: false,
    detailPage: false,
    appDownPopupIsOpen: false,
    firstPurchasePopupIsOpen: false,
    firstPurchaseRewardPopupIsOpen: false,
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

  @action
  sendNative = (arg1, arg2) => {
    if (this.eventDetail.detailPageLink.indexOf('signup')) {
      devLog('sign up to native ', arg1, arg2);
      if (isAndroid()) {
        if (window.Android) {
          window.Android.processData(arg1, arg2);
        }
      } else if (isIOS()) {
        devLog('ios');
      } else {
        devLog('data', arg1);
      }
    }
  };

  @action
  appDownPopupOpen = () => {
    // let getCookie = document.cookie;
    // console.log(getCookie, 'getCookie');
    this.status.appDownPopupIsOpen = true;
  };

  @action
  appDownPopupClose = stop => {
    if (stop) {
      this.setPopupCookie('appDownPopupStop');
    }
    this.status.appDownPopupIsOpen = false;
  };

  // @action
  // firstPurchasePopupOpen = () => {
  //   this.status.firstPurchasePopupIsOpen = true;
  // };

  // @action
  // firstPurchasePopupClose = stop => {
  //   if (stop) {
  //     this.setPopupCookie('firstPurchasePopupStop');
  //   }
  //   this.status.firstPurchasePopupIsOpen = false;
  // };

  setPopupCookie = name => {
    let now = new Date();
    now.setDate(now.getDate() + 1); // 현재시간 부터 1일 뒤 계산
    document.cookie = name + '=true;expires=' + now.toUTCString();
  };
}
