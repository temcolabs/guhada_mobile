import { observable, action } from 'mobx';
import { isBrowser } from 'childs/lib/common/isServer';
import API from 'childs/lib/API';
import { devLog } from 'childs/lib/common/devLog';
import moment from 'moment';
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
      .then((res) => {
        let data = res.data.data;
        const isMobile = /Mobile|iP(hone|od)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/.test(
          window.navigator.userAgent
        )
          ? true
          : false;

        for (let i = 0; i < data.length; i++) {
          if (localStorage.getItem(data[i].eventTitle)) {
            let getItem = JSON.parse(localStorage.getItem(data[i].eventTitle));

            if (moment(getItem.setDate).diff(moment(), 'days') !== 0) {
              !isMobile && data[i].agent === 'MOBILE'
                ? (data[i].popupStatus = false)
                : (data[i].popupStatus = true);
              localStorage.removeItem(data[i].eventTitle);
              this.setAppDownLink(data[i]);
            } else {
              data[i].popupStatus = false;
            }
          } else {
            !isMobile && data[i].agent === 'MOBILE'
              ? (data[i].popupStatus = false)
              : (data[i].popupStatus = true);
            this.setAppDownLink(data[i]);
          }
        }
        this.popupList = [...data];
        devLog(this.popupList, 'eventPopupList');
      })
      .catch((err) => {
        console.error(err, 'settle popup err');
      });
  };

  @action
  appEventPopupClose = ({ stop = false }, title) => {
    if (stop) {
      this.setPopupLocalStorage(title);
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

  setPopupLocalStorage = (name) => {
    let data = {
      name: name,
      setDate: +moment().startOf('second'),
    };
    localStorage.setItem(name, JSON.stringify(data));
  };

  setAppDownLink = (data) => {
    if (isIOS() && data.eventTitle === '앱다운로드') {
      data.appDownLink = 'https://apps.apple.com/app/id1478120259';
    } else if (isAndroid() && data.eventTitle === '앱다운로드') {
      data.appDownLink =
        'https://play.google.com/store/apps/details?id=io.temco.guhada';
    }
  };
}
