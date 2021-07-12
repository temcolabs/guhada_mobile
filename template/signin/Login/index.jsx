import css from './Login.module.scss';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import LoginLayout from 'components/layout/LoginLayout';
import { LoginInput, LoginButton, SaveIdCheckBox } from 'components/login';
import { observer } from 'mobx-react';
import { LinkRoute } from 'lib/router';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
import KakaoLogin from 'react-kakao-login';
import NaverLogin from 'components/login/NaverLogin';
import ErrorToast from 'components/common/ErrorToast';
import { snsAppKey } from 'lib/constant/sns';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';

let userId = Cookies.get('userId');

function Login({ form }) {
  /**
   * states
   */
  const [checkSaveId, setCheckSaveId] = useState(userId ? true : false);
  const router = useRouter();
  const { login: loginStore } = useStores();

  /**
   * side effects
   */
  useEffect(() => {
    if (loginStore.loginStatus === 'LOGIN_DONE') {
      router.push('/');
    }
    if (checkSaveId) {
      Cookies.set('userId', form.$('email'));
      form.$('email').set(userId);
    } else {
      Cookies.remove('userId');
    }
  }, []);

  /**
   * render
   */
  return (
    <LoginLayout pageTitle={'로그인'} close back={false}>
      <ErrorToast />
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
            id="save-id"
            onChange={() => setCheckSaveId(!checkSaveId)}
            checked={checkSaveId}
          >
            아이디 저장
          </SaveIdCheckBox>
        </div>
        <div>
          <LoginButton
            className={
              !(form.$('email') && form.$('password')) ? 'isGray' : 'isColored'
            }
            onClick={form.onSubmit}
            disabled={!(form.$('email') && form.$('password'))}
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
            onSuccess={loginStore.responseKakao}
            onFailure={loginStore.responseKakao}
            getProfile={true}
            render={(props) => (
              <div
                className={css.social}
                onClick={(e) => {
                  e.preventDefault();
                  props.onClick();
                }}
              >
                <div className="social-icon login-kakao" />
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
            callback={loginStore.responseFacebook}
            cookie={true}
            xfbml={true}
            isMobile={true}
            disableMobileRedirect={true}
            render={(renderProps) => (
              <div className={css.social} onClick={renderProps.onClick}>
                <div className="social-icon login-facebook" />
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
              <div className={css.social} onClick={renderProps.onClick}>
                <div className="social-icon login-google" />
                <div className={css.text}>
                  구글
                  <br />
                  로그인
                </div>
              </div>
            )}
            buttonText="Login"
            onSuccess={loginStore.responseGoogle}
            onFailure={loginStore.responseGoogle}
          />
        </div>
      </div>
    </LoginLayout>
  );
}

Login.propTypes = {
  form: PropTypes.any,
};

export default observer(Login);
