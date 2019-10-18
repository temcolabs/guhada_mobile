import { observable, action, toJS } from 'mobx';
import API from 'lib/API';
import Router from 'next/router';
import moment from 'moment';
import { devLog } from 'lib/devLog';
import daumTrakers from 'lib/tracking/daum/daumTrakers';

const isServer = typeof window === 'undefined';
export default class OrderPaymentStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable successInfo = {};
  @observable orderSuccessNumber;
  @observable orderSuccessShipping = {};
  @observable orderSuccessProduct = {};
  @observable orderSuccessProductOption = [];
  @observable orderSuccessUser;
  @observable vbankExpireAt;
  @observable orderAt = null;

  @observable status = {
    pageStatus: false,
    paymentInfoStatus: false,
  };

  @action
  getOrderPaymentSuccessInfo = id => {
    API.order
      .get(`/order/order-complete/${id}`)
      .then(res => {
        let data = res.data;

        this.successInfo = data.data;
        this.orderSuccessNumber = data.data.orderNumber;
        this.orderSuccessShipping = data.data.shippingAddress;
        this.orderSuccessProduct = data.data.orderList;

        if (this.successInfo.payment.parentMethod === 'VBank') {
          this.getVBankExpireAt();
        } else {
          this.getOrderdate();
        }
        devLog(toJS(this.successInfo), '주문완료 정보');

        // daumTrakers.purchaseComplete({orderID : id , amount : this.successInfo.totalOrderPrice })

        this.status.pageStatus = true;
      })
      .catch(err => {
        devLog(err);
        // this.root.alert.showConfirm({
        //   content: 'error',
        //   confirmText: '메인화면 돌아가기',
        //   cancelText: '취소',
        //   onConfirm: () => {
        //     this.gotoMain();
        //   },
        // });
        // Router.push('/');
        sessionStorage.removeItem('paymentInfo');
      })
      .finally(() => {
        sessionStorage.removeItem('paymentInfo');
      });
  };
  gotoMain = () => {
    Router.push('/');
  };

  decodeLoginData = accessToken => {
    devLog(accessToken);
    let loginInfoKey;
    if (accessToken) {
      loginInfoKey = accessToken.split('.');
    }
    this.loginInfo = JSON.parse(window.atob(loginInfoKey[1]));
    devLog(this.loginInfo);
  };

  @action
  paymentInfoModal = () => {
    this.getVBankExpireAt();
    this.status.paymentInfoStatus = !this.status.paymentInfoStatus;
  };

  @action
  paymentInfoModalClose = () => {
    this.status.paymentInfoStatus = !this.status.paymentInfoStatus;
  };

  getVBankExpireAt = () => {
    this.vbankExpireAt = moment(
      this.successInfo.payment.vbankExpireTimestamp
    ).format('YYYY.MM.DD HH:mm');
  };

  getOrderdate = () => {
    this.orderAt = moment(this.orderSuccessProduct[0].orderTimestamp).format(
      'YYYY.MM.DD HH:mm'
    );
  };

  dataInit = () => {
    this.successInfo = {};
    this.orderSuccessNumber = null;
    this.orderSuccessShipping = {};
    this.orderSuccessProduct = {};
    this.orderSuccessProductOption = [];
    this.orderSuccessUser = null;
    this.orderTotalQuantity = 0;
    this.vbankExpireAt = null;
    this.orderAt = null;

    this.status = {
      pageStatus: false,
      paymentInfoStatus: false,
    };
  };
}
