import { observable, action } from 'mobx';
import API from 'childs/lib/API';
import Router from 'next/router';
import Form from '../stores/form-store/_.forms';
import { root } from 'store';
import { pushRoute } from 'childs/lib/router';
import { devLog } from 'childs/lib/common/devLog';
import _ from 'lodash';

export default class AuthMobileStore {
  @observable authKey = '';
  @observable authData;
  @observable verifyParams = {
    birth: '',
    diCode: '',
    gender: '',
    identityVerifyMethod: '',
    mobile: '',
    name: '',
  };
  @action
  getCertKey = (location, childWindow) => {
    API.order.get('/mobile/phoneCertification').then(res => {
      const key = res.data.data;
      this.authKey = key;
      let verifyParams = this.verifyParams;
      let authData = this.authData;
      let checkIdentity = this.checkIdentity;
      document.form_chk.action =
        'https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb';
      document.form_chk.target = 'popupChk';
      document.form_chk.submit();

      const onReceiveMessageFromPopup = function(event) {
        devLog(`event.origin`, event.origin);
        devLog(`event.data`, event.data);

        window.removeEventListener('message', onReceiveMessageFromPopup);

        // 팝업 윈도우 닫기
        childWindow.close();

        // TODO: 인증완료 다음단계 진행
        // location 파라미터 : findpassword, findid, order
        devLog(location);
        authData = event.data;
        devLog('authData', authData);

        if (authData.sBirthDate) {
          verifyParams.birth = authData.sBirthDate.replace(
            /(\d{4})(\d{2})(\d{2})/g,
            '$1-$2-$3'
          );
          verifyParams.diCode = authData.sDueInfo;
          verifyParams.gender = authData.sGender === '0' ? 'FEMALE' : 'MALE';
          verifyParams.identityVerifyMethod = 'MOBILE';
          verifyParams.mobile = authData.sMobileNo;
          verifyParams.name = authData.sName;

          if (location === 'findpassword') {
            checkIdentity(authData, afterResponse, afterException);
            function afterResponse() {
              Router.push('/login/findpasswordresult');
            }

            function afterException(e) {
              root.alert.showAlert(_.get(e, 'data.message'));
            }
          } else if (location === 'findid') {
            let data = event.data;

            API.user
              .post('/users/findUserId', {
                mobile: data.sMobileNo,
                name: data.sName,
                diCode: data.sDueInfo,
              })
              .then(function(res) {
                let data = res.data;

                Form.idFind.$('email').set(data.data.email);
                Form.idFind.$('joinAt').set(data.data.joinAt);
                Form.idFind.$('phoneNumber').set(data.data.phoneNumber);
                Form.idFind.$('authMobile').set(true);
                Router.push('/login/findidresult');
              })
              .catch(e => {
                let resultCode = _.get(e, 'data.resultCode');
                if (resultCode === 5004)
                  root.alert.showConfirm({
                    content: '해당 정보와 일치하는 아이디가 없습니다.',
                    confirmText: '가입하기',
                    onConfirm: () => {
                      pushRoute('/login/signup');
                    },
                  });
                else devLog(e);
              });
          } else if (location === 'order') {
            devLog(authData, 'authData');
            API.user
              .put('/users/identity-verify', {
                birth: authData.sBirthDate.replace(
                  /(\d{4})(\d{2})(\d{2})/g,
                  '$1-$2-$3'
                ),
                diCode: authData.sDueInfo,
                gender: authData.sGender === '0' ? 'FEMALE' : 'MALE',
                identityVerifyMethod: 'MOBILE',
                mobile: authData.sMobileNo,
                name: authData.sName,
              })
              .then(function(res) {
                let data = res.data;
                devLog('data', data);
                root.orderpayment.orderUserInfo.name = authData.sName;
                root.orderpayment.orderUserInfo.mobile = authData.sMobileNo;
                root.customerauthentication.userVerify = authData.sDueInfo;
                root.alert.showAlert({
                  content: '본인인증 완료',
                });
              })
              .catch(err => {
                let resultCode = _.get(err, 'data.resultCode');
                let message = _.get(err, 'data.message');
                devLog(resultCode, message, 'message', 'resultCode');
                if (resultCode) {
                  root.alert.showAlert({
                    content: message,
                  });
                } else {
                  root.alert.showAlert({
                    content: '본인인증실패',
                  });
                }
              });
          } else if (location === 'luckydrawModify') {
            checkIdentity(authData, afterResponse, afterException);

            function afterResponse() {
              root.alert.showConfirm({
                content: '이미 본인 인증이 된 아이디가 존재합니다.',
              });
            }

            function afterException(e) {
              let resultCode = _.get(e, 'data.resultCode');
              if (resultCode === 5004) {
                let form = Form.modifyLuckydraw;
                let value = form.values();

                let body = {
                  birth: authData.sBirthDate.replace(
                    /(\d{4})(\d{2})(\d{2})/g,
                    '$1-$2-$3'
                  ),
                  diCode: authData.sDueInfo,
                  gender: authData.sGender === '0' ? 'FEMALE' : 'MALE',
                  identityVerifyMethod: 'MOBILE',
                  mobile: authData.sMobileNo,
                  name: authData.sName,
                };

                form.$('diCode').set('value', body.diCode);
                form.$('gender').set('value', body.gender);
                form.$('mobile').set('value', body.mobile);
                form.$('name').set('value', body.name);
                form.$('birth').set('value', body.birth);

                form.$('authMobileButton').set('label', '인증완료');
                form.$('authMobileButton').set('value', 'complete');

                form.$('verifiedIdentityUpdated').set('value', true);
              }
            }
          } else if (location === 'luckydrawSignup') {
            checkIdentity(authData, afterResponse, afterException);

            function afterResponse() {
              root.alert.showConfirm({
                content: '이미 본인 인증이 된 아이디가 존재합니다.',
              });
            }

            function afterException(e) {
              let resultCode = _.get(e, 'data.resultCode');
              if (resultCode === 5004) {
                let form;

                // sns 로그인 포지션에 따른 분기문 처리
                if (root.login.loginPosition === 'luckydrawSNS') {
                  form = Form.signUpSNSLuckydraw;
                } else {
                  form = Form.signUpLuckydraw;
                }

                let body = {
                  birth: authData.sBirthDate.replace(
                    /(\d{4})(\d{2})(\d{2})/g,
                    '$1-$2-$3'
                  ),
                  diCode: authData.sDueInfo,
                  gender: authData.sGender === '0' ? 'FEMALE' : 'MALE',
                  identityVerifyMethod: 'MOBILE',
                  mobile: authData.sMobileNo,
                  name: authData.sName,
                };

                form.$('diCode').set('value', body.diCode);
                form.$('gender').set('value', body.gender);
                form.$('mobile').set('value', body.mobile);
                form.$('name').set('value', body.name);
                form.$('birth').set('value', body.birth);
                form.$('authMobileButton').set('label', '인증완료');
                form.$('authMobileButton').set('value', 'complete');
              }
            }
          }
        }
      };

      // 팝업에서 postMessage로 데이터 받아오는 이벤트 연결
      window.addEventListener('message', onReceiveMessageFromPopup, false);
    });
  };

  @action
  checkIdentity = (authData, afterResponse, afterException) => {
    API.user
      .post(`/users/identity-verify`, {
        diCode: authData.sDueInfo,
      })
      .then(function(res) {
        afterResponse();
      })
      .catch(e => {
        afterException(e);
      });
  };
}
