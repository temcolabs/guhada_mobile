import { observable, action, toJS } from 'mobx';
import API from 'childs/lib/API';
import Router from 'next/router';
import moment from 'moment';
import { devLog } from 'childs/lib/common/devLog';

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
    return API.order
      .get(`/order/order-complete/${id}`)
      .then(({ data }) => {
        const successInfo = data.data;
        devLog('주문완료 정보', successInfo);

        this.successInfo = successInfo;
        this.orderSuccessNumber = data.data.orderNumber;
        this.orderSuccessShipping = data.data.shippingAddress;
        this.orderSuccessProduct = data.data.orderList;

        if (successInfo.payment.parentMethod === 'VBank') {
          this.getVBankExpireAt();
        } else {
          this.getOrderdate();
        }

        this.status.pageStatus = true;

        return successInfo;
      })
      .catch(err => {
        console.error(err, 'orderpayment success err');
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
