import { observable, action } from 'mobx';
import API from 'lib/API';
import _ from 'lodash';
import { devLog } from 'lib/devLog';
const isServer = typeof window === 'undefined';

export default class CustomerAuthentication {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable emailAuthentication = false;
  @observable sendMailSuccess = false;
  @observable userVerify = null;
  @observable emailVerifyCode;
  @observable email = '';
  @observable emailValid = true;
  @action
  emailAuthenticationSend = (email, name) => {
    if (!this.userVerify) {
      this.root.alert.showAlert('본인인증을 먼저 진행해주세요.');
      return false;
    }
    this.email = email;
    this.sendMailSuccess = false;
    devLog(name, email, 'thisemail');
    let emailValid = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    if (emailValid.test(email) === false) {
      this.root.alert.showAlert({
        content: '올바르지 않은 이메일형식 입니다.',
      });
    } else {
      API.user
        .post(`/verify/sendEmail`, {
          email,
          name,
        })
        .then(res => {
          this.root.alert.showAlert('인증메일을 발송하였습니다.');
          this.sendMailSuccess = true;
        })
        .catch(err => {
          // this.root.alert.showAlert({
          //   content: `${_.get(err, 'data.message') || 'ERROR'}`,
          // });
        });
    }
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
        API.user
          .put(`users/email-verify`, {
            email: this.email,
            verificationNumber: this.emailVerifyCode,
          })
          .then(res => {
            this.emailAuthentication = true;
            this.root.orderpayment.orderUserInfo.emailVerify = true;
            this.emailValid = true;
            this.root.alert.showAlert('이메일 인증성공');
            this.sendMailSuccess = false;
          })
          .catch(err => {
            let resultCode = _.get(err, 'data.resultCode');
            devLog(resultCode, 'resultCode');
            if (resultCode) {
              this.root.alert.showAlert({
                content: _.get(err, 'data.message'),
              });
            }
          });
      })
      .catch(err => {
        let resultCode = _.get(err, 'data.resultCode');
        devLog(resultCode, 'resultCode');
        if (resultCode) {
          this.root.alert.showAlert({
            content: _.get(err, 'data.message'),
          });
        }
      });
  };

  @action
  emailValidCheck = e => {
    this.email = e.target.value;
  };

  @action
  dataInit = () => {
    this.email = '';
  };
}
