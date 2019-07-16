import { observable, action, toJS } from 'mobx';
import { autoHypenPhone } from '../utils';
import API from 'lib/API';
import Router from 'next/router';
import prependZero from '../lib/string/prependZero';

const isServer = typeof window === 'undefined';
export default class OrderPaymentStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable orderSuccessNumber;
  @observable orderSuccessShipping;
  @observable orderSuccessProduct = {};
  @observable orderSuccessProductOption = [];
  @observable orderSuccessPayment;
  @observable orderSuccessUser;
  @observable vbankExpireAt;
  @observable completeAt = '';

  @observable status = {
    pageStatus: false,
    paymentInfoStatus: false,
  };
  @observable orderSuccessAmount = {
    totalProdPrice: 0,
    totalShipPrice: 0,
    totalDiscountDiffPrice: 0,
    totalPaymentPrice: 0,
  };

  @action
  getOrderPaymentSuccessInfo = id => {
    API.order
      .get(`/order/order-complete/${id}`)
      .then(res => {
        let data = res.data;

        if (data.resultCode === 200) {
          this.orderSuccessNumber = data.data.orderNumber;
          this.orderSuccessShipping = data.data.shippingAddress;
          this.orderSuccessProduct = data.data.orderList;
          this.orderSuccessPayment = data.data.payment;

          this.orderSuccessAmount.totalProdPrice = data.data.totalProdPrice;
          this.orderSuccessAmount.totalShipPrice = data.data.totalShipPrice;
          this.orderSuccessAmount.totalDiscountDiffPrice =
            data.data.totalDiscountDiffPrice;
          this.orderSuccessAmount.totalPaymentPrice =
            data.data.totalPaymentPrice;

          this.getPhoneWithHypen();
          this.getOptions();
          this.getCompleteAt();

          console.log(toJS(data), '주문완료 정보');
          this.status.pageStatus = true;

          sessionStorage.removeItem('paymentInfo');
        }
      })
      .catch(err => {
        console.log(err);
        this.root.alert.showConfirm({
          content: 'error',
          confirmText: '메인화면 돌아가기',
          cancelText: '취소',
          onConfirm: () => {
            this.gotoMain();
          },
        });
        sessionStorage.removeItem('paymentInfo');
      });
  };
  gotoMain = () => {
    Router.push('/');
  };
  getPhoneWithHypen = () => {
    this.orderSuccessShipping.phone = autoHypenPhone(
      this.orderSuccessShipping.phone
    );
  };

  //--------------------- 주문완료상품 옵션 데이터 가져오기 ---------------------
  getOptions = () => {
    let tempAttribute = '';
    let tempArray = [];
    let branchArray = [];
    this.orderSuccessProduct.map((data, index) => {
      tempAttribute = '';
      tempArray = [];
      for (let key in data) {
        if (key.indexOf('Attribute') !== -1) {
          if (data[key] !== null) {
            tempArray.push(data[key]);
          }
        }
      }
      for (let x = 0; x < tempArray.length; x++) {
        tempAttribute += tempArray[x] + '/';
      }

      tempAttribute = tempAttribute.substr(0, tempAttribute.length - 1);
      if (tempAttribute == '') {
        branchArray.push('옵션없는상품');
      } else {
        branchArray.push(tempAttribute);
      }
    });
    this.orderSuccessProductOption = branchArray;
  };

  decodeLoginData = accessToken => {
    console.log(accessToken);
    let loginInfoKey;
    if (accessToken) {
      loginInfoKey = accessToken.split('.');
    }
    this.loginInfo = JSON.parse(window.atob(loginInfoKey[1]));
    console.log(this.loginInfo);
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
    let tempDate = '';
    // this.orderSuccessPayment.vbankExpireAt.map((data, index) => {
    //   tempDate += data + '.';
    // });
    tempDate = `(${this.orderSuccessPayment.vbankExpireAt[0]}.${
      this.orderSuccessPayment.vbankExpireAt[1]
    }.${this.orderSuccessPayment.vbankExpireAt[2]} ${
      this.orderSuccessPayment.vbankExpireAt[3]
    }:${this.orderSuccessPayment.vbankExpireAt[4]} 까지)`;

    this.vbankExpireAt = tempDate;
  };

  getCompleteAt = () => {
    // this.orderSuccessPayment.vbankExpireAt.map((data, index) => {
    //   tempDate += data + '.';
    // });

    this.orderSuccessPayment.completeAt[1] = prependZero(
      this.orderSuccessPayment.completeAt[1]
    );
    this.orderSuccessPayment.completeAt[2] = prependZero(
      this.orderSuccessPayment.completeAt[2]
    );

    this.completeAt = `${this.orderSuccessPayment.completeAt[0]}.${
      this.orderSuccessPayment.completeAt[1]
    }.${this.orderSuccessPayment.completeAt[2]} ${
      this.orderSuccessPayment.completeAt[3]
    }:${this.orderSuccessPayment.completeAt[4]}`;

    console.log(this.completeAt, 'this.completeAt');
  };
}
