import { observable, action } from 'mobx';
import Axios from 'axios';
import Cookies from 'js-cookie';
import API from 'lib/API';
import Router from 'next/router';
import Form from '../stores/form-store/_.forms';
import openPopupCenter from 'lib/dom/openPopupCenter';
import { root } from 'store';

const isServer = typeof window === 'undefined';

export default class AuthMobileStore {
  @observable authKey = '';
  @action
  getCertKey = location => {
    API.order.get('phoneCertification').then(res => {
      console.log(res.data.data, 'res.data.data');
      const key = res.data.data;
      this.authKey = key;
      let authData;
      const childWindow = openPopupCenter('', 'popupChk', 500, 550);

      document.form_chk.action =
        'https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb';
      document.form_chk.target = 'popupChk';
      document.form_chk.submit();

      const onReceiveMessageFromPopup = function(event) {
        console.log(`event.origin`, event.origin);
        console.log(`event.data`, event.data);
        console.log(childWindow);
        window.removeEventListener('message', onReceiveMessageFromPopup);

        // 팝업 윈도우 닫기
        childWindow.close();

        // TODO: 인증완료 다음단계 진행
        // location 파라미터 : findpassword, findid
        console.log(location);
        authData = event.data;

        if (authData.sBirthDate) {
          if (location === 'findpassword') {
            Router.push('/login/findpasswordresult');
          } else if (location === 'findid') {
            let data = event.data;

            API.user
              .get(
                '/findUserId?phoneNumber=' +
                  data.sMobileNo +
                  '&name=' +
                  data.sName
              )
              .then(function(res) {
                let data = res.data;

                if (data.resultCode === 200) {
                  Form.idFind.$('email').set(data.data.email);
                  Form.idFind.$('joinAt').set(data.data.joinAt);
                  Form.idFind.$('phoneNumber').set(data.data.phoneNumber);
                  Form.idFind.$('authMobile').set(true);
                  Router.push('/login/findidresult');
                } else {
                  form.$('name').invalidate(' ');
                  form.$('mobile').invalidate(data.data.result);
                }
              });
          } else if (location === 'order') {
            console.log(authData, 'authData');
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
                if (err.data.resultCode === 6019) {
                  root.alert.showAlert({
                    content: err.data.message,
                  });
                }
              });
          }
        }
      };

      // 팝업에서 postMessage로 데이터 받아오는 이벤트 연결
      window.addEventListener('message', onReceiveMessageFromPopup, false);
    });
  };
}
