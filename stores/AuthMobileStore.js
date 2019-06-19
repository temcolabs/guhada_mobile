import { observable, action } from 'mobx';
import Axios from 'axios';
import Cookies from 'js-cookie';
import API from 'lib/API';
import Router from 'next/router';
import Form from '../stores/form-store/_.forms';
import openPopupCenter from 'lib/dom/openPopupCenter';

const isServer = typeof window === 'undefined';

export default class AuthMobileStore {
  @observable authKey = '';
  @observable authData;
  @action
  getCertKey = location => {
    Axios.get('http://13.209.10.68/phoneCertification').then(res => {
      console.log(res.data.data);
      const key = res.data.data;
      this.authKey = key;

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
        this.authData = event.data;
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
        }
      };

      // 팝업에서 postMessage로 데이터 받아오는 이벤트 연결
      window.addEventListener('message', onReceiveMessageFromPopup, false);
    });
  };
}
