import React from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
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
import { ErrorToast } from 'components/common/errorToast';

@inject('login')
@observer
class Login extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { form, login } = this.props;
    let value = form.get('value');

    return (
      <DefaultLayout pageTitle={'로그인'}>
        <LoginWrapper>
          <div className={css.wrap}>
            <div className={css.findIdWrap}>
              <span>
                <LinkRoute href="/login/findid">
                  <a className={css.findLinkWrap}>아이디찾기</a>
                </LinkRoute>
              </span>
              <span className={css.line}></span>
              <span>
                <LinkRoute href="/login/findpassword">
                  <a className={css.findLinkWrap}>비밀번호찾기</a>
                </LinkRoute>
              </span>
            </div>
            <div>
              <LoginInput field={form.$('email')} />
              <LoginInput field={form.$('password')} />
            </div>
            <div className={css.checkWrap}>
              <LoginCheckBox id={'autoLogin'}>자동로그인</LoginCheckBox>
              <LoginCheckBox id={'save-id'}>아이디저장</LoginCheckBox>
              <LinkRoute>
                <a className={css.nomember__order}>비회원 주문조회</a>
              </LinkRoute>
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
                jsKey={login.kakaoKey}
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
                appId={login.facebookKey}
                autoLoad={false}
                callback={login.responseFacebook}
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
                clientId={login.googleKey}
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
      </DefaultLayout>
    );
  }
}

export default Login;
