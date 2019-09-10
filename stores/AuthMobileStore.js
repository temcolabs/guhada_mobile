import { observable, action } from 'mobx';
import Axios from 'axios';
import Cookies from 'js-cookie';
import API from 'lib/API';
import Router from 'next/router';
import Form from '../stores/form-store/_.forms';
import openPopupCenter from 'lib/dom/openPopupCenter';
import { root } from 'store';
import { pushRoute } from 'lib/router';
import { devLog } from 'lib/devLog';

const isServer = typeof window === 'undefined';

export default class AuthMobileStore {
  @observable authKey = '';
  @observable authData;
  @action
  getCertKey = location => {
    API.order.get('phoneCertification').then(res => {
      const key = res.data.data;
      this.authKey = key;

      const childWindow = openPopupCenter('', 'popupChk', 500, 550);

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
        // location 파라미터 : findpassword, findid
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
              }
            })
            .catch(e => {
              root.alert.showConfirm({
                content: '해당 정보와 일치하는 아이디가 없습니다.',
                confirmText: '가입하기',
                onConfirm: () => {
                  pushRoute('/login/selectsignup');
                },
              });
            });
        }
      };

      // 팝업에서 postMessage로 데이터 받아오는 이벤트 연결
      window.addEventListener('message', onReceiveMessageFromPopup, false);
    });
  };
}
