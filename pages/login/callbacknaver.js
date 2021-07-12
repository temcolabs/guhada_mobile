import { Component } from 'react';
import { observer, inject } from 'mobx-react';
import loadScript from 'lib/dom/loadScript';
import { snsAppKey } from 'lib/constant/sns';
import withAuth from 'components/common/hoc/withAuth';
import { devLog } from 'lib/common/devLog';
import { HOSTNAME } from 'lib/constant/hostname';
import { getParameterByName } from 'lib/utils';

//TODO
const client_id = snsAppKey.NAVER;
const redirectURI = encodeURI(`${HOSTNAME}/callbacknaver`);

@inject('login', 'luckyDraw')
@observer
class callbacknaver extends Component {
  componentDidMount() {
    const { login, luckyDraw } = this.props;
    login.loginPosition = getParameterByName('location', window.location.href);
    luckyDraw.luckydrawDealId = getParameterByName(
      'luckydrawDealId',
      window.location.href
    );

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
          naverLogin.getLoginStatus((status) => {
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
