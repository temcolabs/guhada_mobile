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
    API.benefit
      .get(`/benefits/summary`)
      .then(res => {
        let data = res.data.data;
        console.log(res, 'res');
        this.couponList = data.content;
        console.log(this.couponList, 'this.couponList');
      })
      .catch(err => {
        console.log(err);
        this.root.alert.showAlert({
          content: `ERROR`,
        });
        return false;
        // this.root.alert.showAlert({
        //   content: `${err.data.message}`,
        // });
      });
  };
}
