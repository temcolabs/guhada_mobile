import { Component, Fragment } from 'react';
import css from '../../template/signin/Login/Login.module.scss';
import { observer, inject } from 'mobx-react';
import loadScript from 'lib/dom/loadScript';
import { snsAppKey } from 'lib/constant/sns';
import { isBrowser } from 'lib/common/isServer';
import { HOSTNAME } from 'lib/constant/hostname';

const client_id = snsAppKey.NAVER;
let redirectURI = encodeURI(`${HOSTNAME}/callbacknaver`);

@inject('luckyDraw')
@observer
class NaverLogin extends Component {
  componentDidMount() {
    if (isBrowser) {
      this.loadNaverLogin();
      if (this.props.luckydrawSNS === true) {
        this.props.luckyDraw.loginPosition = 'luckydrawSNS';
      }
    }
  }

  loadNaverLogin = () => {
    const { loginPosition, luckydrawDealId } = this.props;

    if (loginPosition === 'checkPassword') {
      redirectURI = encodeURI(
        `${HOSTNAME}/callbacknaver?location=checkPassword`
      );
    } else if (loginPosition === 'luckydrawSNS') {
      redirectURI = encodeURI(
        `${HOSTNAME}/callbacknaver?location=luckydrawSNS&luckydrawDealId=${luckydrawDealId}`
      );
    }

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
        {this.props.render ? (
          this.props.render
        ) : (
          <div
            className={css.social}
            id="naverIdLogin_loginButton"
            onClick={this.props.onClick}
          >
            <div id="naverIdLogin" className="social-icon login-naver" />
            <div className={css.text}>
              네이버
              <br />
              로그인
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

export default NaverLogin;
