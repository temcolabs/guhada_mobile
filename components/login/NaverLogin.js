import React, { Fragment } from 'react';
// import css from './NaverLogin.module.scss';
import css from '../../template/signin/Login.module.scss';
import { observer } from 'mobx-react';
import loadScript from 'childs/lib/dom/loadScript';
import { snsAppKey } from 'constant/sns';
import { isBrowser } from 'lib/isServer';
import { HOSTNAME } from 'constant/hostname';

const client_id = snsAppKey.NAVER;
const redirectURI = encodeURI(`${HOSTNAME}/callbacknaver`);

@observer
class NaverLogin extends React.Component {
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
      },
    });
  };

  render() {
    return (
      <Fragment>
        <div className={css.social} id="naverIdLogin_loginButton">
          <div
            id="naverIdLogin"
            className={css.icon}
            style={{
              backgroundImage: "url('/static/icon/social/login_btn_naver.png')",
            }}
          />
          <div className={css.text}>
            네이버
            <br />
            로그인
          </div>
        </div>
      </Fragment>
    );
  }
}

export default NaverLogin;
