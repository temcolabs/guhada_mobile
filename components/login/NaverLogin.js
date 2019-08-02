import React, { Fragment } from 'react';
// import css from './NaverLogin.module.scss';
import css from '../../template/signin/Login.module.scss';
import { observer } from 'mobx-react';
import { loadScript } from 'lib/dom';
import { snsAppKey } from 'constant/sns';
import { isBrowser } from 'lib/isServer';

// web poc
const client_id = snsAppKey.NAVER;
const redirectURI = encodeURI(`${process.env.HOSTNAME}/callbacknaver`);

@observer
class NaverLogin extends React.Component {
  componentDidMount() {
    if (isBrowser) {
      this.loadNaverLogin();
    }
  }

  loadNaverLogin = () => {
    loadScript('http://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js', {
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
        <div className={css.social}>
          <div
            id="naverIdLogin"
            className={css.icon}
            style={{
              backgroundImage: "url('/static/icon/social/login_btn_naver.png')",
            }}
          />
          <div className={css.text} id="naverIdLogin_loginButton">
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
