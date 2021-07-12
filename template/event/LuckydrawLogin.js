import React, { Component } from 'react';
import ModalWrapper from 'components/common/modal/ModalWrapper';
import { LoginWrapper, LoginInput, LoginButton } from 'components/login';
import css from './LuckydrawLogin.module.scss';
import { LinkRoute, pushRoute } from 'lib/router';
import SaveIdCheckBox from 'components/login/SaveIdCheckBox';
import Form from 'stores/form-store/_.forms';
import { snsAppKey } from 'lib/constant/sns';
import KakaoLogin from 'react-kakao-login';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import Cookies from 'js-cookie';
import { observer, inject } from 'mobx-react';
import NaverLogin from 'components/login/NaverLogin';
import _ from 'lodash';
import gtagTracker from 'lib/tracking/google/gtagTracker';

let userId = Cookies.get('userId');

@inject('login', 'luckyDraw')
@observer
class LuckydrawLogin extends Component {
  constructor(props) {
    super(props);
    this.state = { checkSaveId: userId ? true : false };
  }

  componentDidMount() {
    // let { form } = this.props;
    // if (this.state.checkSaveId) {
    //   form.$('email').set(userId);
    // }
  }

  onChangeSaveId = (e) => {
    this.setState({
      checkSaveId: !this.state.checkSaveId,
    });
  };

  render() {
    const form = Form.signInLuckydraw;

    let value;

    if (_.isNil(form)) {
      return null;
    } else {
      value = form.get('value');
    }

    const { isOpen, closeModal, luckyDraw, login } = this.props;
    return (
      <ModalWrapper
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel={'LuckydrawLogin'}
        contentStyle={{
          position: 'fixed',
          top: '0px',
          left: '0px',
          transform: 'none',
        }}
        zIndex={999}
      >
        <div className={css.loginWrap}>
          <div className={css.headerWrap}>
            <div className={css.emptyButton} />
            로그인
            <div className={css.closeButton} onClick={() => closeModal()} />
          </div>

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
                <SaveIdCheckBox
                  id={'save-id'}
                  onChange={this.onChangeSaveId}
                  checked={this.state.checkSaveId}
                >
                  아이디 저장
                </SaveIdCheckBox>
              </div>
              <div>
                <LoginButton
                  className={
                    !(value.email && value.password) ? 'isGray' : 'isColored'
                  }
                  onClick={(e) => {
                    gtagTracker.gaEvent.luckyDrawLogin();
                    form.onSubmit(e);
                  }}
                  disabled={!(value.email && value.password)}
                >
                  로그인
                </LoginButton>

                <LoginButton
                  onClick={() => {
                    gtagTracker.gaEvent.luckyDrawSignup();
                    closeModal();
                    luckyDraw.setLuckydrawSignupModal(true);
                  }}
                >
                  회원가입
                </LoginButton>
              </div>
              <div className={css.socialHeader}>간편 로그인</div>
              <div className={css.socialWrap}>
                <NaverLogin
                  onClick={gtagTracker.gaEvent.luckyDrawNaverSignup}
                  luckydrawSNS={true}
                />
                <KakaoLogin
                  jsKey={snsAppKey.KAKAO}
                  onSuccess={login.responseKakao}
                  onFailure={login.responseKakao}
                  getProfile={true}
                  render={(props) => (
                    <div
                      className={css.social}
                      onClick={(e) => {
                        e.preventDefault();
                        gtagTracker.gaEvent.luckyDrawKakaoSignup();
                        props.onClick();
                        login.loginPosition = 'luckydrawSNS';
                      }}
                    >
                      <div
                        className={css.icon}
                        style={{
                          backgroundImage:
                            "url('/public/icon/social/login_btn_kakao.png')",
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
                  render={(renderProps) => (
                    <div
                      className={css.social}
                      onClick={() => {
                        gtagTracker.gaEvent.luckyDrawFacebookSignup();
                        renderProps.onClick();
                        login.loginPosition = 'luckydrawSNS';
                      }}
                    >
                      <div
                        className={css.icon}
                        style={{
                          backgroundImage:
                            "url('/public/icon/social/login_btn_facebook.png')",
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
                  render={(renderProps) => (
                    <div
                      className={css.social}
                      onClick={() => {
                        gtagTracker.gaEvent.luckyDrawGoogleSignup();
                        renderProps.onClick();
                        login.loginPosition = 'luckydrawSNS';
                      }}
                    >
                      <div
                        className={css.icon}
                        style={{
                          backgroundImage:
                            "url('/public/icon/social/login_btn_google.png')",
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
        </div>
      </ModalWrapper>
    );
  }
}

export default LuckydrawLogin;
