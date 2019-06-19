import { observable, action, toJS } from 'mobx';

import Cookies from 'js-cookie';
import Router from 'next/router';
import API from 'lib/API';

const isServer = typeof window === 'undefined';

export default class CustomerAuthentication {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable emailAuthentication = false;
  @observable sendMailSuccess = false;
  @observable emailVerify = this.root.orderpayment.orderUserInfo.emailVerify;
  @observable emailVerifyCode;
  @observable email;
  @action
  emailAuthenticationSend = (email, name) => {
    this.email = email;
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
      });
  };

  @action
  emailAuthenticationCode = e => {
    this.emailVerifyCode = e.target.value;
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
        if (res.data.resultCode === 200) {
          API.user.put(`users/email-verify`).then(res => {
            if (res.data.resultCode === 200) {
              this.emailAuthentication = true;
              this.emailVerify = true;
            }
            this.root.alert.showAlert({
              content: '이메일 인증성공',
            });
          });
        } else if (res.data.resultCode === 6004) {
          this.root.alert.showAlert({
            content: '유효시간 경과, 다시 발급받으세요',
          });
        } else {
          this.root.alert.showAlert({
            content: '유효하지 않는 코드입니다.',
          });
        }
      });
  };
}
