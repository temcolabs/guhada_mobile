import { observable, action, toJS } from 'mobx';
import { isBrowser } from 'childs/lib/common/isServer';
import API from 'childs/lib/API';
import { devLog } from 'childs/lib/common/devLog';
import moment from 'moment';
import Cookies from 'js-cookie';
export default class EventPopupStore {
  constructor(root, initialState) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable popupList = [];
  @observable status = {
    appDownPopupIsOpen: false,
  };

  @action
  appDownPopupOpen = () => {
    API.settle
      .get(`/event/main/popup`)
      .then(res => {
        this.status.appDownPopupIsOpen = true;
        this.popupList = res.data.data;

        for (let i = 0; i < this.popupList.length; i++) {
          this.popupList[i].eventStatus = true;
        }
        // Cookies.get('appDownPopupStop');
        console.log(this.popupList, 'this.popupListthis.popupList');
      })
      .catch(err => {
        console.log(err, 'settle popup err');
      });
  };

  @action
  appDownPopupClose = id => {
    // if (stop) {
    //   this.setPopupCookie('appDownPopupStop');
    // }
    for (let i = 0; i < this.popupList.length; i++) {
      // this.popupList[i].id === id{
      // }
    }
    this.status.appDownPopupIsOpen = false;
  };

  @action
  firstPurchasePopupOpen = () => {
    API.settle
      .get(`/event/main/popup`)
      .then(res => {
        console.log(res, 'rerseresresres');
        this.status.firstPurchasePopupIsOpen = true;
      })
      .catch(err => {
        console.log(err, 'settle popup err');
      });
  };

  @action
  firstPurchasePopupClose = stop => {
    if (stop) {
      this.setPopupCookie('firstPurchasePopupStop');
    }
    this.status.firstPurchasePopupIsOpen = false;
  };

  setPopupCookie = name => {
    let now = new Date();
    now.setDate(now.getDate() + 1); // 현재시간 부터 1일 뒤 계산
    document.cookie = name + '=true;expires=' + now.toUTCString();
  };
}
