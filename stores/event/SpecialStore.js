import { observable, action, toJS } from 'mobx';
import API from 'childs/lib/API';
import { isBrowser } from 'childs/lib/common/isServer';
import { devLog } from 'childs/lib/common/devLog';

export default class SpecialStore {
  constructor(root, initialState) {
    if (isBrowser) {
      this.root = root;
    }

    // 이벤트 상세 데이터
    if (initialState.special?.specialDetail) {
      this.specialDetail = initialState.special?.specialDetail;
    }
  }

  @observable specialList = [];
  @observable specialDetail = {};
  @observable status = {
    page: false,
    detailPage: false,
    firstPurchasePopupIsOpen: false,
  };

  @action
  getSpecialList = value => {
    if (!value?.value) {
      API.settle
        .get(`/plan/list?eventProgress=ALL`)
        .then(res => {
          this.specialListMain = res.data.data;
          this.specialList = res.data.data;
          this.status.page = true;
          devLog(toJS(this.specialList), 'special list');
        })
        .catch(err => {
          console.log(err, 'special list get error');
          this.specialList = [];
        });
    } else {
      API.settle
        .get(`/plan/list?eventProgress=${value.value}`)
        .then(res => {
          this.specialList = [...res.data.data];
          this.status.page = true;
          devLog(toJS(this.specialList), 'special list');
        })
        .catch(err => {
          console.log(err, 'special list get error');
          this.specialList = [];
        });
    }
  };

  @action
  getSpecialDetail = ({ id, page = 1 }) => {
    API.settle
      .get(`/plan/list/detail?`, {
        params: {
          eventId: id,
          page: page,
        },
      })
      .then(res => {
        this.specialDetail = res.data.data;
        this.totalItemCount = this.specialDetail.totalItemCount;
        this.status.detailPage = true;
        this.page = page;
        devLog(toJS(this.specialDetail), this.totalItemCount, 'special detail');
      })
      .catch(err => {
        console.log(err, 'special detail get error');
        this.specialDetail = [];
      });
  };

  getUrl = () => {
    let url = this.specialDetail.detailPageLink;
    let start = url.indexOf('com');
    let query = url.substr(start + 3);

    if (query.indexOf('signup')) {
      this.specialDetail.detailPageLink = '/login/selectsignup';
    } else {
      this.specialDetail.detailPageLink = query;
    }
  };
}
