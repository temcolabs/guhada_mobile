import { observable, action, toJS } from 'mobx';
import API from 'lib/API';
import { isBrowser } from 'lib/common/isServer';
import { getUserAgent } from '../../utils';
import { dateFormat } from 'lib/constant/date';
import moment from 'moment';
import { devLog } from 'lib/common/devLog';

export default class MypagePointChargeStore {
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
  @observable pointChargeHistory = [];
  @observable chargePoint = undefined;
  @observable additionPoint = 0;
  @observable paymentMethod = 'CARD';
  @observable paymentForm = {};
  @observable paymentMethodImage = {
    CARD: true,
    PHONE: false,
    DirectBank: false,
    VBank: false,
  };
  @observable priorityAgreement = false;
  @observable paymentProcessAgreement = false;
  @observable notifyAgreement = false;
  @observable paymentProceed = false;

  @action
  checkPaymentRemain = () => {
    let paymentRemainCheck = JSON.parse(
      sessionStorage.getItem('paymentInfoPoint')
    );

    if (paymentRemainCheck) {
      this.chargePoint = paymentRemainCheck.amount;
      this.additionPoint = parseInt(this.chargePoint / 10);
      this.paymentMethod = paymentRemainCheck.parentMethodCd;
      this.methodChange();
      this.paymentProcessAgreement = true;
      this.notifyAgreement = true;

      sessionStorage.removeItem('paymentInfoPoint');
    }
  };

  @action
  getPointChargeHistory = ({
    startDate = this.period.startDate,
    endDate = this.period.endDate,
    pageNo = 1,
  }) => {
    devLog(startDate, endDate, pageNo, 'pointcharge');
    this.pointChargeHistory = [];
  };

  @action
  chargePointSelect = (point) => {
    if (!this.chargePoint) {
      this.chargePoint = 0;
    }
    let currentPoint = parseInt(this.chargePoint);
    devLog(currentPoint, 'currentPoint');
    this.chargePoint = currentPoint + point;
    this.additionPoint = parseInt(this.chargePoint / 10);
  };

  // @action
  // chargePointChange = e => {
  //   let point = e.target.value;
  //   point = point.replace(/[^0-9]/g, '');
  //   this.chargePoint = point;
  //   this.additionPoint = parseInt(this.chargePoint / 10);
  // };

  @action
  cancelChargePoint = () => {
    this.chargePoint = 0;
    this.additionPoint = parseInt(this.chargePoint / 10);
  };

  //--------------------- 결제방법변경 ---------------------
  @action
  setPaymentMethod = (targetMethod) => {
    this.paymentMethod = targetMethod;
    this.methodChange();
  };

  //--------------------- 결제방법변경 모듈 ---------------------
  methodChange = () => {
    this.paymentMethodImage = {
      CARD: false,
      PHONE: false,
      DirectBank: false,
      VBank: false,
    };

    switch (this.paymentMethod) {
      case 'CARD':
        this.paymentMethodImage.CARD = true;
        break;
      case 'PHONE':
        this.paymentMethodImage.PHONE = true;
        break;
      case 'DirectBank':
        this.paymentMethodImage.DirectBank = true;
        break;
      case 'VBank':
        this.paymentMethodImage.VBank = true;
        break;
    }
  };
  @action
  setPriorityCheck = () => {
    this.priorityAgreement = !this.priorityAgreement;

    if (this.priorityAgreement) {
      this.paymentProcessAgreement = true;
      this.notifyAgreement = true;
    } else {
      this.paymentProcessAgreement = false;
      this.notifyAgreement = false;
    }
  };

  @action
  setProcessCheck = () => {
    this.priorityAgreement = false;
    this.paymentProcessAgreement = !this.paymentProcessAgreement;
  };

  @action
  setNotifyCheck = () => {
    this.priorityAgreement = false;
    devLog(this.priorityAgreement, 'this.priorityAgreement');
    this.notifyAgreement = !this.notifyAgreement;
  };

  @action
  payment = () => {
    if (this.chargePoint <= 0 || !this.chargePoint) {
      this.root.alert.showAlert({
        content: '충전금액을 설정해 주세요',
      });
      return false;
    } else if (!this.paymentProcessAgreement) {
      this.root.alert.showAlert({
        content: '결제진행동의 를 해주세요',
      });
      return false;
    } else if (!this.notifyAgreement) {
      this.root.alert.showAlert({
        content: '알림 문구를 확인하고 동의 해주세요',
      });
      return false;
    }

    let forms = {
      amount: this.chargePoint,
      parentMethodCd: this.paymentMethod,
      userAgent: getUserAgent(),
      web: true,
    };

    let returnUrl = 'https://dev.guhada.com:8080/chargePointResult';

    API.order
      .post(`/payment/payment-point-request`, forms)
      .then((res) => {
        if (res.data.resultCode === 200) {
          this.paymentProceed = true;
          let data = res.data.data;
          devLog(data, 'requestOrder return data');

          this.paymentForm = {
            acceptMethod: data.acceptMethod,
            appScheme: data.appScheme,
            cardCd: data.cardCd,
            cardQuota: data.cardQuota,
            chainCode: data.chainCode,
            charset: data.charset,
            currency: data.currency,
            epOption: data.epOption,
            epType: data.epType,
            errorCode: data.errorCode,
            expireDate: data.expireDate,
            firmNm: data.firmNm,
            inputOption: data.inputOption,
            jsUrl: data.jsUrl,
            key: data.key,
            kmotionUseyn: data.kmotionUseyn,
            kvpPgid: data.kvpPgid,
            mallNm: data.mallNm,
            methodCd: data.methodCd,
            mobileCd: data.mobileCd,
            msgCode: data.msgCode,
            msgType: data.msgType,
            nextUrl: data.msgType,
            offerPeriod: data.offerPeriod,
            parentMethodCd: data.parentMethodCd,
            payViewType: data.payViewType,
            payshotKey: data.payshotKey,
            pgAmount: data.pgAmount,
            pgKind: data.pgKind,
            pgMid: data.pgMid,
            pgOid: data.pgOid,
            preMsgType: data.preMsgType,
            prodNm: data.prodNm,
            purchaseEmail: data.purchaseEmail,
            purchaseNm: data.purchaseNm,
            purchasePhone: data.purchasePhone,
            returnUrl: returnUrl,
            serialNo: data.serialNo,
            signature: data.signature,
            timeOutYn: data.timeOutYn,
            timeout: data.timeout,
            timestamp: data.timestamp,
            version: data.version,
          };
          sessionStorage.setItem('paymentInfoPoint', JSON.stringify(forms));
        }
      })
      .catch((error) => {
        if (this.root.login.loginStatus === 'logout') {
          this.root.alert.showAlert({
            content: '로그인 을 해주세요.',
          });
        } else {
          this.root.alert.showAlert({
            content: '서버 에러 ' + error,
          });
        }
        this.root.alert.showAlert({
          content: '결제에 실패 하였습니다.',
        });
        devLog(error);
        this.paymentProceed = false;
      });
  };

  @action
  paymentStart = () => {
    window.INIStdPay.pay('pointChargePaymentForm');
  };
}
