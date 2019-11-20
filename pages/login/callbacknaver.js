import { Component } from 'react';
import Axios from 'axios';
import { observer, inject } from 'mobx-react';
import Cookies from 'js-cookie';
import Router from 'next/router';
import loadScript from 'childs/lib/dom/loadScript';
import API from 'childs/lib/API';
import { key } from 'constant';
import { snsAppKey } from 'constant/sns';
import withAuth from 'components/common/hoc/withAuth';
import { devLog } from 'childs/lib/common/devLog';
import { HOSTNAME } from 'constant/hostname';

//TODO
const client_id = snsAppKey.NAVER;
const redirectURI = encodeURI(`${HOSTNAME}/callbacknaver`);

@inject('uistatus', 'login')
@observer
class callbacknaver extends Component {
  componentDidMount() {
    const { uistatus, login } = this.props;
    loadScript('https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js', {
      id: 'naveridlogin_js_sdk',
      onLoad: () => {
        let naverLogin = new naver.LoginWithNaverId({
          clientId: client_id,
          callbackUrl: redirectURI,
          callbackHandle: true,
          isPopup: false,
        });
        naverLogin.init();
        window.addEventListener('load', () => {
          naverLogin.getLoginStatus(status => {
            if (status) {
              var email = naverLogin.user.getEmail();
              if (email === undefined || email === null) {
                alert('이메일은 필수정보입니다. 정보제공을 동의해주세요.');
                /* (5-1) 사용자 정보 재동의를 위하여 다시 네아로 동의페이지로 이동함 */
                naverLogin.reprompt();
                return;
              }

              login.responseNaver(naverLogin);
            } else {
              devLog('callback 처리에 실패하였습니다.');
            }
          });
        });
      },
    });
  }

  render() {
    return null;
  }
}

export default withAuth({ isAuthRequired: false })(callbacknaver);
