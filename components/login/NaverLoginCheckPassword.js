import React, { Fragment } from 'react';
import css from './NaverLogin.module.scss';

import { observer, inject } from 'mobx-react';
import loadScript from 'childs/lib/dom/loadScript';
import { snsAppKey } from 'childs/lib/constant/sns';
import { isBrowser } from 'childs/lib/common/isServer';
import { HOSTNAME } from 'childs/lib/constant/hostname';
import { devLog } from 'childs/lib/common/devLog';

const client_id = snsAppKey.NAVER;
const redirectURI = encodeURI(`${HOSTNAME}/callbacknaver`);

@observer
class NaverLoginCheckPassword extends React.Component {
  componentDidMount() {
    if (isBrowser) {
      this.loadNaverLogin();
    }
  }

  loadNaverLogin = () => {
    loadScript('https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js', {
      id: 'naveridlogin_js_sdk',
      onLoad: () => {
        let naverLogin = new naver.LoginWithNaverId({
          clientId: client_id,
          callbackUrl: redirectURI,
          isPopup: false,
        });
        naverLogin.init();

        naverLogin.getLoginStatus(status => {
          console.log('status', status);
          console.log('naverLogin', naverLogin);
          if (status) {
            var email = naverLogin.user.getEmail();
            if (email === undefined || email === null) {
              alert('이메일은 필수정보입니다. 정보제공을 동의해주세요.');
              /* (5-1) 사용자 정보 재동의를 위하여 다시 네아로 동의페이지로 이동함 */
              naverLogin.reprompt();
              return;
            }
          } else {
            devLog('callback 처리에 실패하였습니다.');
          }
        });
      },
    });
  };

  render() {
    return <Fragment>{this.props.render}</Fragment>;
  }
}

export default NaverLoginCheckPassword;
