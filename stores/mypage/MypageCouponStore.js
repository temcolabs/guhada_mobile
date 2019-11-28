import { observable, action, toJS } from 'mobx';
import API from 'childs/lib/API';
import { isBrowser } from 'childs/lib/common/isServer';
import { devLog } from 'childs/lib/common/devLog';

export default class MypageCouponStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable validCouponList = [];
  @observable invalidCouponList = [];
  @observable activeTab = true;
  @observable itemsCountPerPage = 8;
  @observable validTotalItem = 0;
  @observable invalidTotalItem = 0;
  @observable validCouponPage = 1;
  @observable invalidCouponPage = 1;
  @observable conponRegisterNum = 0;
  @action
  validCoponTab = () => {
    this.activeTab = true;
  };
  @action
  invalidCoponTab = () => {
    this.activeTab = false;
  };
  @action
  getVaildCoupon = ({ page = 1 }) => {
    API.benefit
      .get(
        `/coupon/wallet?isAvailable=true&page=${page}&unitPerPage=${
          this.itemsCountPerPage
        }`
      )
      .then(res => {
        let data = res.data.data;
        if (res.status === 200) {
          this.validCouponList = data.content;
          this.validTotalItem = data.totalElements;

          this.validCouponPage = page;

          devLog(toJS(this.validCouponList), 'this.validCouponList');
        }
      })
      .catch(err => {
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || 'err.message'}`,
        // });
      });
  };

  @action
  getInvaildCoupon = ({ page = 1 }) => {
    API.benefit
      .get(
        `/coupon/wallet?isAvailable=false&page=${page}&unitPerPage=${
          this.itemsCountPerPage
        }`
      )
      .then(res => {
        let data = res.data.data;
        if (res.status === 200) {
          this.invalidCouponList = data.content;
          this.invalidTotalItem = data.totalElements;

          this.invalidCouponPage = page;

          devLog(this.invalidCouponList, 'this.invalidCouponList');
        }
      })
      .catch(err => {
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || 'err.message'}`,
        // });
      });
  };

  @action
  deleteCoupon = couponNumber => {
    this.root.alert.showConfirm({
      content: '쿠폰을 삭제 하시겠습니까?',
      onConfirm: () => {
        API.benefit
          .delete(`/coupon/wallet/${couponNumber}`)
          .then(res => {
            if (this.activeTab) {
              for (let i = 0; i < this.validCouponList.length; i++) {
                if (this.validCouponList[i].couponNumber === couponNumber) {
                  this.validCouponList.splice(i, 1);
                  this.validTotalItem -= 1;
                }
              }
            } else {
              for (let i = 0; i < this.invalidCouponList.length; i++) {
                if (this.invalidCouponList[i].couponNumber === couponNumber) {
                  this.invalidCouponList.splice(i, 1);
                  this.invalidTotalItem -= 1;
                }
              }
            }

            // 대시보드 데이터 새로고침
            this.root.mypageDashboard.getDashboard();

            // this.root.alert.showAlert('쿠폰이 삭제 되었습니다.');
          })
          .catch(err => {
            console.error(err, 'coupon delete error');
            // this.root.alert.showAlert({
            //   content: `${_.get(err, 'data.message') || 'err.message'}`,
            // });
          });
      },
    });
  };

  @action
  couponRegisterHandle = num => {
    this.conponRegisterNum = num;
  };
  @action
  couponRegister = () => {
    if (this.conponRegisterNum) {
      this.root.alert.showAlert({
        content: `유효하지 않은 쿠폰입니다.`,
      });
    } else {
      this.root.alert.showAlert({
        content: `쿠폰번호를 입력해주세요.`,
      });
    }
  };
}
