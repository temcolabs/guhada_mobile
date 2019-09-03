import { observable, action } from 'mobx';
import API from 'lib/API';

const isServer = typeof window === 'undefined';

export default class OrderPaymentCouponStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable status = {
    couponModal: false,
  };
  @observable couponList = [];

  @action
  modalShow = () => {
    this.status.couponModal = true;
  };
  @action
  modalHide = () => {
    this.status.couponModal = false;
  };
  @action
  couponSelect = () => {
    console.log('11');
  };
  @action
  getCouponList = () => {
    // API.benefit
    //   .get(`https://dev.benefit.guhada.com/coupons?page=1&unitPerPage=3`)
    //   .then(res => {
    //     let data = res.data.data;
    //     console.log(res, 'res');
    //     if (res.data.resultCode === 200) {
    //       this.couponList = data.content;
    //       console.log(this.couponList, 'this.couponList');
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     this.root.alert.showAlert({
    //       content: `${err.data.message}`,
    //     });
    //   });
    this.modalShow();
  };
}
