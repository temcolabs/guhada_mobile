import { observable, action, toJS } from 'mobx';
import API from 'childs/lib/API';
const isServer = typeof window === 'undefined';
import { isBrowser } from 'childs/lib/common/isServer';
import { dateFormat } from 'constant/date';
import moment from 'moment';
import { devLog } from 'childs/lib/common/devLog';
import { getParameterByName } from 'utils';

export default class MypagePointStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }

    // 기본 기간
    this.defaultPeriod = {
      startDate: moment()
        .subtract(7, 'days')
        .format(dateFormat.YYYYMMDD),
      endDate: moment().format(dateFormat.YYYYMMDD),
    };
  }

  @observable period = this.defaultPeriod;
  // 나의 포인트리스트
  @observable pointSummary = {};
  @observable pointHistory = [];
  @observable pointChargeModal = false;
  @observable totalItemsCount = 0;
  @observable itemsCountPerPage = 10;
  @observable page = 1;
  @action
  getPointSummary = () => {
    API.benefit.get(`/summary`).then(res => {
      if (res.data.resultCode === 200) {
        this.pointSummary = res.data.data;
      }
    });
  };

  @action
  getPointHistory = ({
    startDate = this.period.startDate,
    endDate = this.period.endDate,
    pageNo = 1,
  }) => {
    API.benefit
      .get(`/histories?fromAt=${startDate}&toAt=${endDate}&page=${pageNo}`)
      .then(res => {
        if (res.data.resultCode === 200) {
          this.period.startDate = startDate;
          this.period.endDate = endDate;
          this.pointHistory = res.data.data;
          this.totalItemsCount = res.data.data.totalElements;
          this.page = pageNo;
          devLog(res.data, '포인트 히스토리');
        }
      });

    let paymentRemainCheck = JSON.parse(
      sessionStorage.getItem('paymentInfoPoint')
    );

    if (paymentRemainCheck) {
      let resultMsg = getParameterByName('resultMsg');

      if (resultMsg !== 'chargesuccess') {
        this.root.alert.showAlert({
          content: resultMsg || '포인트 충전 실패.',
        });
        this.pointChargeModal = true;
      } else {
        this.root.alert.showAlert({
          content: '포인트 충전 성공',
        });
        sessionStorage.removeItem('paymentInfoPoint');
      }
    }
  };

  @action
  pointChargeModalOpen = () => {
    this.pointChargeModal = true;
  };

  @action
  pointChargeModalClose = () => {
    this.pointChargeModal = false;
  };
}
