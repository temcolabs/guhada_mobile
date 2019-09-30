import { observable, action } from 'mobx';
import API from 'lib/API';
import Router from 'next/router';
import Form from '../stores/form-store/_.forms';
import openPopupCenter from 'lib/dom/openPopupCenter';
import { root } from 'store';
import { pushRoute } from 'lib/router';
import { devLog } from 'lib/devLog';
import _ from 'lodash';
const isServer = typeof window === 'undefined';

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
    API.order.get('phoneCertification').then(res => {
      console.log(res.data.data, 'res.data.data');
      const key = res.data.data;
      this.authKey = key;
      let verifyParams = this.verifyParams;
      let authData = this.authData;
      // const childWindow = openPopupCenter('', 'popupChk', 500, 550);
      // const childWindow = window.open('_blank', 'popupChk');
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
            console.log(authData, 'authData ?');
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
                console.log(data);
                if (data.resultCode === 200) {
                  root.orderpayment.orderUserInfo.name = authData.sName;
                  root.orderpayment.orderUserInfo.mobile = authData.sMobileNo;
                  root.alert.showAlert({
                    content: '본인인증 완료',
                  });
                }
              })
              .catch(err => {
                let resultCode = _.get(err, 'data.resultCode');
                let message = _.get(err, 'data.message');
                if (resultCode === 6019) this.root.alert.showAlert(message);
              });
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
