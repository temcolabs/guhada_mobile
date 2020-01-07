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
  @observable validTotalPage = 0;
  @observable invalidTotalPage = 0;
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
        this.validCouponList = data.content;
        this.validTotalItem = data.totalElements;
        this.validTotalPage = data.totalPages;
        this.validCouponPage = page;

        devLog(toJS(this.validCouponList), 'this.validCouponList');
      })
      .catch(err => {
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || 'err.message'}`,
        // });
      });
  };

  @action
  getMoreVaildCoupon = () => {
    API.benefit
      .get(
        `/coupon/wallet?isAvailable=true&page=${this.validCouponPage +
          1}&unitPerPage=${this.itemsCountPerPage}`
      )
      .then(res => {
        this.validCouponList = this.validCouponList.concat(
          res.data.data.content
        );
        this.validTotalItem = res.data.data.totalElements;
        this.validTotalPage = res.data.data.totalPages;
        this.validCouponPage = this.validCouponPage + 1;
        devLog(res, 'this.validCouponList');
      })
      .catch(err => {
        console.log(err);
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || 'ERROR'}`,
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
        this.invalidCouponList = data.content;
        this.invalidTotalItem = data.totalElements;
        this.invalidTotalPage = data.totalPages;
        this.invalidCouponPage = page;

        devLog(res, 'this.invalidCouponList');
      })
      .catch(err => {
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || 'err.message'}`,
        // });
      });
  };

  @action
  getMoreInvaildCoupon = () => {
    API.benefit
      .get(
        `/coupon/wallet?isAvailable=false&page=${this.invalidCouponPage +
          1}&unitPerPage=${this.itemsCountPerPage}`
      )
      .then(res => {
        this.invalidCouponList = this.invalidCouponList.concat(
          res.data.data.content
        );
        this.invalidTotalItem = res.data.data.totalElements;
        this.invalidTotalPage = res.data.data.totalPages;
        this.invalidCouponPage = this.invalidCouponPage + 1;
        devLog(res, 'this.invalidCouponList');
      })
      .catch(err => {
        console.log(err);
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || 'ERROR'}`,
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
