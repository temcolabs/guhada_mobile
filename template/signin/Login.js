import React from 'react';
import LoginLayout from 'components/layout/LoginLayout';
import css from './Login.module.scss';
import {
  LoginInput,
  LoginButton,
  LoginCheckBox,
  LoginWrapper,
} from 'components/login/';
import { observer, inject } from 'mobx-react';
import { format } from 'util';
import { LinkRoute } from 'lib/router';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
import KakaoLogin from 'react-kakao-login';
import NaverLogin from 'components/login/NaverLogin';
import SaveIdCheckBox from 'components/login/SaveIdCheckBox';
import Cookies from 'js-cookie';
import { snsAppKey } from 'constant/sns';
import Router from 'next/router';

let userId = Cookies.get('userId');

@inject('login')
@observer
class Login extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = { checkSaveId: userId ? true : false };
  }

  componentDidMount() {
    let { form } = this.props;
    if (this.state.checkSaveId) {
      form.$('email').set(userId);
    }
    if (this.props.login.loginStatus === 'LOGIN_DONE') {
      Router.push('/');
    }
  }

  onChangeSaveId = e => {
    this.setState({
      checkSaveId: !this.state.checkSaveId,
    });
  };

  render() {
    const { form, login } = this.props;
    let { checkSaveId } = this.state;
    let value = form.get('value');

    if (checkSaveId === true) {
      Cookies.set('userId', value.email);
    } else {
      Cookies.remove('userId');
    }

    return (
      <LoginLayout pageTitle={'로그인'} close={true} back={false}>
        <LoginWrapper>
          <div className={css.wrap}>
            <div className={css.findIdWrap}>
              <span>
                <LinkRoute href="/login/findid">
                  <a className={css.findLinkWrap}>아이디 찾기</a>
                </LinkRoute>
              </span>
              <span className={css.line} />
              <span>
                <LinkRoute href="/login/findpassword">
                  <a className={css.findLinkWrap}>비밀번호 찾기</a>
                </LinkRoute>
              </span>
            </div>
            <div>
              <LoginInput field={form.$('email')} />
              <LoginInput field={form.$('password')} />
            </div>
            <div className={css.checkWrap}>
              {/* <LoginCheckBox id={'autoLogin'}>자동로그인</LoginCheckBox> */}
              <SaveIdCheckBox
                id={'save-id'}
                onChange={this.onChangeSaveId}
                checked={this.state.checkSaveId}
              >
                아이디 저장
              </SaveIdCheckBox>
              {/* <LinkRoute href="/login/term">
                <a className={css.nomember__order}>비회원 주문조회</a>
              </LinkRoute> */}
            </div>
            <div>
              <LoginButton
                className={
                  !(value.email && value.password) ? 'isGray' : 'isColored'
                }
                onClick={form.onSubmit}
                disabled={!(value.email && value.password)}
              >
                로그인
              </LoginButton>
              <LinkRoute href="/login/signup">
                <a>
                  <LoginButton>회원가입</LoginButton>
                </a>
              </LinkRoute>
            </div>
            <div className={css.socialHeader}>간편 로그인</div>
            <div className={css.socialWrap}>
              <NaverLogin />
              <KakaoLogin
                jsKey={snsAppKey.KAKAO}
                onSuccess={login.responseKakao}
                onFailure={login.responseKakao}
                getProfile={true}
                render={props => (
                  <div
                    className={css.social}
                    onClick={e => {
                      e.preventDefault();
                      props.onClick();
                    }}
                  >
                    <div
                      className={css.icon}
                      style={{
                        backgroundImage:
                          "url('/static/icon/social/login_btn_kakao.png')",
                      }}
                    />
                    <div className={css.text}>
                      카카오톡
                      <br />
                      로그인
                    </div>
                  </div>
                )}
              />
              <FacebookLogin
                appId={snsAppKey.FACEBOOK}
                autoLoad={false}
                fields="name,email"
                callback={login.responseFacebook}
                cookie={true}
                xfbml={true}
                isMobile={true}
                disableMobileRedirect={true}
                render={renderProps => (
                  <div className={css.social} onClick={renderProps.onClick}>
                    <div
                      className={css.icon}
                      style={{
                        backgroundImage:
                          "url('/static/icon/social/login_btn_facebook.png')",
                      }}
                    />
                    <div className={css.text}>
                      페이스북
                      <br />
                      로그인
                    </div>
                  </div>
                )}
              />
              <GoogleLogin
                clientId={snsAppKey.GOOGLE}
                render={renderProps => (
                  <div className={css.social} onClick={renderProps.onClick}>
                    <div
                      className={css.icon}
                      style={{
                        backgroundImage:
                          "url('/static/icon/social/login_btn_google.png')",
                      }}
                    />
                    <div className={css.text}>
                      구글
                      <br />
                      로그인
                    </div>
                  </div>
                )}
                buttonText="Login"
                onSuccess={login.responseGoogle}
                onFailure={login.responseGoogle}
              />
            </div>
          </div>
        </LoginWrapper>
      </LoginLayout>
    );
  }
}

export default Login;
