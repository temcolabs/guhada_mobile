import React, { useState, useEffect, useMemo, useCallback } from 'react';
import css from './CheckPassword.module.scss';
import Input from '../form/Input';
import SubmitButton, {
  SubmitButtonWrapper,
  CancelButton,
} from '../form/SubmitButton';
import cn from 'classnames';
// import NaverLogin from 'components/molecules/NaverLogin';
import KakaoLogin from 'react-kakao-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
import { snsAppKey } from 'lib/constant/sns';
import { devLog } from 'lib/common/devLog';
import useStores from 'stores/useStores';
import entryService from 'lib/API/user/entryService';
import { observer } from 'mobx-react';
import NaverLogin from 'components/login/NaverLogin';
import NaverLoginCheckPassword from 'components/login/NaverLoginCheckPassword';
import { key } from 'lib/constant';
import Cookies from 'js-cookie';

function CheckPassword({
  onSubmitPassword = (password) => {},
  checkEditFormVisiblity = () => {}, // 회원정보 수정 양식 표시 확인
}) {
  const { login: loginStore, user: userStore } = useStores();
  const [password, setPassword] = useState(''); // 입력 페스워드
  const { connectedSNS } = userStore;

  // 아이디, 패스워드 입력
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitPassword(password);
  };

  const showEditForm = useCallback(() => {
    // 로그인 성공. 에디터 표시
    userStore.setPasswordDoubleChecked(true);
    checkEditFormVisiblity();
  }, [checkEditFormVisiblity, userStore]);

  useEffect(() => {
    if (loginStore.showEditForm === true) {
      showEditForm();
    }
    loginStore.loginPosition = '';
    loginStore.showEditForm = false;
  });

  return (
    <form className={css.wrap} onSubmit={handleSubmit}>
      <div className={css.notiText}>
        안전한 회원정보 변경을 위해 <br />
        <b>비밀번호</b>를 다시 한번 입력해 주세요.
      </div>
      {/* <div className={css.snsLoginGuide}>
        (이메일 가입자가 아닌 경우, 가입한 SNS 로그인으로 진행해주세요.)
      </div> */}

      <div className={css.pwInputWrap}>
        <input type="text" name="hidden" style={{ display: 'none' }} />
        <Input
          onChange={(value) => setPassword(value)}
          placeholder="비밀번호를 입력해 주세요."
          type="password"
          autoComplete="password"
        />
      </div>

      <SubmitButtonWrapper>
        <CancelButton
          type="button"
          style={{ marginRight: '7px', height: '40px' }}
        >
          취소
        </CancelButton>
        <SubmitButton type="submit" style={{ height: '40px' }}>
          확인
        </SubmitButton>
      </SubmitButtonWrapper>

      <div className={css.orAnotherAuth}>또는</div>

      <div className={css.snsLoginButtons}>
        <NaverLogin
          loginPosition={'checkPassword'}
          render={
            <div
              style={{ display: 'inline-block', width: '50%' }}
              id="naverIdLogin_loginButton"
              onClick={() => {
                loginStore.logout();
              }}
            >
              <button
                id="naverIdLogin"
                name="naver"
                disabled={!connectedSNS.NAVER}
                className={cn({ [css.isOn]: connectedSNS.NAVER })}
              >
                네이버 로그인
              </button>
            </div>
          }
        />
        <KakaoLogin
          jsKey={snsAppKey.KAKAO}
          onSuccess={(res) => {
            entryService
              .kakaoLogin(loginStore.extractKakaoLoginParams(res))
              .then(() => {
                showEditForm();
              });
          }}
          onFailure={(err) => {
            devLog(`err`, err);
          }}
          getProfile={true}
          render={(props) => (
            <button
              name="kakao"
              type="button"
              disabled={!connectedSNS.KAKAO}
              className={cn({ [css.isOn]: userStore.connectedSNS.KAKAO })}
              onClick={props.onClick}
            >
              카카오톡 로그인
            </button>
          )}
        />

        <FacebookLogin
          appId={snsAppKey.FACEBOOK}
          autoLoad={false}
          fields="name,email"
          callback={(res) => {
            entryService
              .facebookLogin(loginStore.extractFacebookLoginParams(res))
              .then(() => {
                showEditForm();
              });
          }}
          cookie={true}
          xfbml={true}
          render={(props) => (
            <button
              name="facebook"
              type="button"
              disabled={!connectedSNS.FACEBOOK}
              className={cn({ [css.isOn]: connectedSNS.FACEBOOK })}
              onClick={props.onClick}
            >
              페이스북 로그인
            </button>
          )}
        />

        <GoogleLogin
          clientId={snsAppKey.GOOGLE}
          render={(renderProps) => (
            <button
              name="google"
              type="button"
              disabled={!connectedSNS.GOOGLE}
              className={cn({ [css.isOn]: connectedSNS.GOOGLE })}
              onClick={renderProps.onClick}
            >
              구글 로그인
            </button>
          )}
          buttonText="Login"
          onSuccess={(res) => {
            entryService
              .googleLogin(loginStore.extractGoogleLoginParams(res))
              .then(() => {
                showEditForm();
              });
          }}
          onFailure={(res) => {
            devLog(`res`, res);
          }}
        />
      </div>
    </form>
  );
}

export default observer(CheckPassword);
