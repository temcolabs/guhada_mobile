import { observable, action } from 'mobx';
import API from 'childs/lib/API';
import { isBrowser } from 'childs/lib/common/isServer';
import { dateFormat } from 'childs/lib/constant/date';
import moment from 'moment';
import { devLog } from 'childs/lib/common/devLog';

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
  @observable totalItemsPage = 0;
  @observable page = 1;

  @action
  getPointSummary = () => {
    API.benefit
      .get(`/summary`)
      .then(res => {
        this.pointSummary = res.data.data;
        devLog(this.pointSummary, 'this.pointSummary');
      })
      .catch(err => {
        console.log(err);
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
        this.period.startDate = startDate;
        this.period.endDate = endDate;
        this.pointHistory = res.data.data;
        this.pointHistory = res.data.data.content;
        this.totalItemsCount = res.data.data.totalElements;
        this.totalItemsPage = res.data.data.totalPages;
        this.page = pageNo;
        devLog(res.data, '포인트 히스토리');
      })
      .catch(err => {
        console.log(err);
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || 'ERROR'}`,
        // });
      });

    // let paymentRemainCheck = JSON.parse(
    //   sessionStorage.getItem('paymentInfoPoint')
    // );

    // if (paymentRemainCheck) {
    //   let resultMsg = getParameterByName('resultMsg');

    //   if (resultMsg !== 'chargesuccess') {
    //     this.root.alert.showAlert({
    //       content: resultMsg || '포인트 충전 실패.',
    //     });
    //     this.pointChargeModal = true;
    //   } else {
    //     this.root.alert.showAlert({
    //       content: '포인트 충전 성공',
    //     });
    //     sessionStorage.removeItem('paymentInfoPoint');
    //   }
    // }
  };

  @action
  getMorePointHistory = () => {
    API.benefit
      .get(
        `/histories?fromAt=${this.period.startDate}&toAt=${
          this.period.endDate
        }&page=${this.page + 1}`
      )
      .then(res => {
        this.pointHistory = this.pointHistory.concat(res.data.data.content);
        this.totalItemsCount = res.data.data.totalElements;
        this.totalItemsPage = res.data.data.totalPages;
        this.page = this.page + 1;
        devLog(res.data, '포인트 히스토리');
      })
      .catch(err => {
        console.log(err);
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || 'ERROR'}`,
        // });
      });
  };

  //   @action
  //   pointChargeModalOpen = () => {
  //     this.pointChargeModal = true;
  //   };

  //   @action
  //   pointChargeModalClose = () => {
  //     this.pointChargeModal = false;
  //   };

  @action
  pointDelete = id => {
    this.root.alert.showConfirm({
      content: '포인트 내역을 삭제 하시겠습니까?',
      onConfirm: () => {
        API.benefit
          .delete(`/histories/${id}`)
          .then(res => {
            if (res.status === 200) {
              this.root.alert.showAlert({
                content: '포인트가 삭제 되었습니다.',
              });

              for (let i = 0; i < this.pointHistory.length; i++) {
                if (this.pointHistory[i].id === id) {
                  this.pointHistory.splice(i, 1);
                }
              }

              devLog(this.pointHistory, 'this.pointHistory');
            }
          })
          .catch(err => {
            console.log(err);
            // this.root.alert.showAlert({
            //   content: `${_.get(err, 'data.message') || 'ERROR'}`,
            // });
          });
      },
    });
  };

  // ============================================================
  // 포인트 적립 알림 모달 관련 변수, 메소드
  // ============================================================
  @observable
  isPointSavingModalOpen = false;

  defaultSavedPointResponse = {
    dueSavedPoint: 0,
    message: '포인트 적립 완료!',
    saveTargetType: 'BUY',
    savedPoint: 0,
    totalFreePoint: 0,
    totalPaidPoint: 0,
  };

  @observable
  savedPointResponse = Object.assign({}, this.defaultSavedPointResponse);

  @action
  setSavedPointResponse = (data = this.defaultSavedPointResponse) => {
    this.savedPointResponse = data;
  };
  @action
  resetSavedPointResponse = () => {
    this.savedPointResponse = Object.assign({}, this.defaultSavedPointResponse);
  };

  @action
  openPointSavingModal = (data = this.defaultSavedPointResponse) => {
    if (data) {
      this.setSavedPointResponse(data);
      this.isPointSavingModalOpen = true;
      this.root.mypageDashboard.getDashboard(); // 대시보드 새로고침
    } else {
      console.error('savedPointResponse 데이터가 없습니다', data);
    }
  };

  @action
  closePointSavingModalOpen = () => {
    this.isPointSavingModalOpen = false;

    // modal close timeout
    setTimeout(() => {
      this.resetSavedPointResponse();
    }, 400);
  };
}
