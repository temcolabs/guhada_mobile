import { observable, action, toJS } from 'mobx';
import { isBrowser } from 'childs/lib/common/isServer';
import API from 'childs/lib/API';
import { devLog } from 'childs/lib/common/devLog';
import moment from 'moment';
import Cookies from 'js-cookie';
import { isIOS, isAndroid } from 'childs/lib/common/detectMobileEnv';
export default class EventPopupStore {
  constructor(root, initialState) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable popupList = [];

  @action
  appEventPopupOpen = () => {
    API.settle
      .get(`/event/main/popup`)
      .then(res => {
        let data = res.data.data;

        for (let i = 0; i < data.length; i++) {
          if (Cookies.get(data[i].eventTitle)) {
            data[i].popupStatus = false;
          } else {
            data[i].popupStatus = true;
            if (isIOS && data[i].eventTitle === '앱다운로드') {
              data[i].appDownLink = 'https://apps.apple.com/app/id1478120259';
            } else if (isAndroid && data[i].eventTitle === '앱다운로드') {
              data[i].appDownLink =
                'https://play.google.com/store/apps/details?id=io.temco.guhada';
            }
          }
        }
        this.popupList = [...data];

        devLog(this.popupList, 'eventPopupList');
      })
      .catch(err => {
        console.log(err, 'settle popup err');
      });
  };

  @action
  appEventPopupClose = ({ stop = false }, title) => {
    if (stop) {
      this.setPopupCookie(title);
    }

    for (let i = 0; i < this.popupList.length; i++) {
      if (this.popupList[i].eventTitle === title) {
        this.popupList[i].popupStatus = false;
      }
    }

    // this.popupList = this.popupList.filter(data => {
    //   return data.id !== id;
    // });
  };

  setPopupCookie = name => {
    let now = new Date();
    now.setDate(now.getDate() + 1); // 현재시간 부터 1일 뒤 계산
    document.cookie = name + '=true;expires=' + now.toUTCString();
  };
}
