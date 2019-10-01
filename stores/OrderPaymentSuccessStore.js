import { observable, action, toJS } from 'mobx';
import API from 'lib/API';
import Router from 'next/router';
import moment from 'moment';
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
  @observable orderAt = null;
  @observable totalDueSavePoint = 0;

  @observable dueSavePoint = {
    buy: 0,
    text: 0,
    photo: 0,
  };
  @observable dueSavePointList = [];

  @observable status = {
    pageStatus: false,
    paymentInfoStatus: false,
  };
  @observable orderSuccessAmount = {
    totalProdPrice: 0,
    totalShipPrice: 0,
    // 포인트 + 쿠폰 + 상품할인
    couponPointProdDiscountPrice: 0,

    // 쿠폰
    couponDiscountPrice: 0,

    //상품할인
    totalDiscountDiffPrice: 0,

    //포인트
    totalPointPayment: 0,
    // 최종결제금액
    totalAmount: 0,
  };

  @action
  getOrderPaymentSuccessInfo = id => {
    API.order
      .get(`/order/order-complete/${id}`)
      .then(res => {
        let data = res.data;

        this.orderSuccessNumber = data.data.orderNumber;
        this.orderSuccessShipping = data.data.shippingAddress;
        this.orderSuccessProduct = data.data.orderList;

        this.orderSuccessPayment = data.data.payment;

        this.orderSuccessAmount.totalProdPrice = data.data.totalProdPrice;
        this.orderSuccessAmount.totalShipPrice = data.data.totalShipPrice;

        // 상품할인 + 포인트 + 쿠폰
        this.orderSuccessAmount.couponPointProdDiscountPrice =
          data.data.couponPointProdDiscountPrice;

        // 쿠폰 할인금액
        this.orderSuccessAmount.couponDiscountPrice =
          data.data.couponDiscountPrice;

        // 포인트 할인 금액
        this.orderSuccessAmount.totalPointPayment = data.data.totalPointPayment;

        //상품할인
        this.orderSuccessAmount.totalDiscountDiffPrice =
          data.data.totalDiscountDiffPrice;

        //최종 결제금액
        this.orderSuccessAmount.totalAmount = data.data.totalAmount;

        this.getOptions();
        this.getBenefitData();
        if (this.orderSuccessPayment.parentMethod === 'VBank') {
          this.getVBankExpireAt();
        } else {
          this.getOrderdate();
        }
        console.log(toJS(data), '주문완료 정보');
        this.status.pageStatus = true;
      })
      .catch(err => {
        console.log(err);
        // this.root.alert.showConfirm({
        //   content: 'error',
        //   confirmText: '메인화면 돌아가기',
        //   cancelText: '취소',
        //   onConfirm: () => {
        //     this.gotoMain();
        //   },
        // });
        Router.push('/');
        sessionStorage.removeItem('paymentInfo');
      })
      .finally(() => {
        sessionStorage.removeItem('paymentInfo');
      });
  };
  gotoMain = () => {
    Router.push('/');
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
        tempAttribute += tempArray[x] + ' ';
      }

      tempAttribute = tempAttribute.substr(0, tempAttribute.length);
      if (tempAttribute === '') {
        branchArray.push(null);
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
    this.vbankExpireAt = moment(
      this.orderSuccessPayment.vbankExpireTimestamp
    ).format('YYYY. MM. DD HH:mm');
  };

  getOrderdate = () => {
    this.orderAt = moment(this.orderSuccessProduct[0].orderTimestamp).format(
      'YYYY. MM. DD HH:mm'
    );
  };
  @action
  getBenefitData = () => {
    let tmp = [];

    for (let i = 0; i < this.orderSuccessProduct.length; i++) {
      tmp.push({
        bundlePrice: this.orderSuccessProduct[i].shipPrice,
        orderProdList: [
          {
            dcategoryId: this.orderSuccessProduct[i].dcategoryId,
            dealId: this.orderSuccessProduct[i].dealId,
            discountPrice: this.orderSuccessProduct[i].discountPrice,
            lcategoryId: this.orderSuccessProduct[i].lcategoryId,
            mcategoryId: this.orderSuccessProduct[i].mcategoryId,
            productPrice: this.orderSuccessProduct[i].orderPrice,
            scategoryId: this.orderSuccessProduct[i].scategoryId,
          },
        ],
      });
    }
    let bundleList = {
      bundleList: tmp,
      pointType: 'BUY',
      serviceType: 'FRONT',
    };
    API.benefit
      .post(`/process/due-save`, bundleList)
      .then(res => {
        // console.log(res, 'res');
        const { data } = res;
        let buy,
          text,
          photo = 0;
        this.totalDueSavePoint = 0;
        for (let i = 0; i < data.data.dueSavePointList.length; i++) {
          this.totalDueSavePoint += data.data.dueSavePointList[i].totalPoint;
        }

        this.dueSavePointList = data.data.dueSavePointList;

        buy = this.dueSavePointList.findIndex(data => {
          return data.pointType === 'BUY';
        });

        text = this.dueSavePointList.findIndex(data => {
          return data.pointType === 'TEXT_REVIEW';
        });

        photo = this.dueSavePointList.findIndex(data => {
          return data.pointType === 'IMG_REVIEW';
        });

        this.dueSavePoint.buy = this.dueSavePointList[buy].totalPoint;
        this.dueSavePoint.text = this.dueSavePointList[text].totalPoint;
        this.dueSavePoint.photo = this.dueSavePointList[photo].totalPoint;

        console.log(this.dueSavePoint, 'duesave data');
      })
      .catch(err => {
        console.error(err.message, 'err');
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || 'ERROR'}`,
        // });
      });
  };

  dataInit = () => {
    this.orderSuccessNumber = null;
    this.orderSuccessShipping = null;
    this.orderSuccessProduct = {};
    this.orderSuccessProductOption = [];
    this.orderSuccessPayment = null;
    this.orderSuccessUser = null;
    this.orderTotalQuantity = 0;
    this.vbankExpireAt = null;
    this.orderAt = null;
    this.totalDueSavePoint = 0;
    this.dueSavePoint = {
      buy: 0,
      text: 0,
      photo: 0,
    };
    this.dueSavePointList = [];
    this.status = {
      pageStatus: false,
      paymentInfoStatus: false,
    };
    this.orderSuccessAmount = {
      totalProdPrice: 0,
      totalShipPrice: 0,
      // 포인트 + 쿠폰 + 상품할인
      couponPointProdDiscountPrice: 0,

      // 쿠폰
      couponDiscountPrice: 0,

      //상품할인
      totalDiscountDiffPrice: 0,

      //포인트
      totalPointPayment: 0,
      // 최종결제금액
      totalAmount: 0,
    };
  };
}
