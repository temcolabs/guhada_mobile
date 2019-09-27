import { observable, action } from 'mobx';
import API from 'lib/API';
import _ from 'lodash';
const isServer = typeof window === 'undefined';

export default class CustomerAuthentication {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable emailAuthentication = false;
  @observable sendMailSuccess = false;
  @observable emailVerifyCode;
  @observable email;

  @action
  emailAuthenticationSend = (email, name) => {
    if (
      !this.root.orderpayment.orderUserInfo.name ||
      !this.root.orderpayment.orderUserInfo.mobile
    ) {
      this.root.alert.showAlert('본인인증을 먼저 진행해주세요.');
      return false;
    }
    this.email = email;
    this.sendMailSuccess = false;
    API.user
      .post(`/verify/sendEmail`, {
        email,
        name,
      })
      .then(res => {
        this.root.alert.showAlert({
          content: '인증메일발송성공',
        });
        this.sendMailSuccess = true;
      })
      .catch(err => {
        // this.root.alert.showAlert({
        //   content: '이메일발송에러',
        // });
        // this.sendMailSuccess = false;
      });
  };

  @action
  emailAuthenticationCode = e => {
    this.emailVerifyCode = e.target.value;
    // console.log(this.emailVerifyCode);
  };

  @action
  emailAuthenticationCodeVerify = () => {
    API.user
      .post(`/verify`, {
        verificationNumber: this.emailVerifyCode,
        verificationTarget: this.email,
        verificationTargetType: 'EMAIL',
      })
      .then(res => {
        API.user
          .put(`users/email-verify`, {
            verificationNumber: this.emailVerifyCode,
          })
          .then(res => {
            this.emailAuthentication = true;
            this.root.orderpayment.orderUserInfo.emailVerify = true;
            this.root.alert.showAlert('이메일 인증성공');
            this.sendMailSuccess = false;
          });
      })
      .catch(err => {
        if (_.get(err, 'data.data.resultCode') === 6004) {
          this.root.alert.showAlert('유효시간 경과, 다시 발급받으세요');
        } else {
          this.root.alert.showAlert('유효하지 않은 코드입니다.');
        }
      });
  };
}
