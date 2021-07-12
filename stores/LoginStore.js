import { computed, observable, action } from 'mobx';
import Cookies from 'js-cookie';
import API from 'lib/API';
import localStorage from 'lib/common/localStorage';
import sessionStorage from 'lib/common/sessionStorage';
import Router from 'next/router';
import { loginStatus } from 'lib/constant';
import key from 'lib/constant/key';
import { isBrowser } from 'lib/common/isServer';
import { pushRoute } from 'lib/router';
import { snsTypes } from 'lib/constant/sns';
import _ from 'lodash';
import { devLog } from 'lib/common/devLog';
import widerplanetTracker from 'lib/tracking/widerplanet/widerplanetTracker';
import entryService from 'lib/API/user/entryService';
import isDev from 'lib/common/isDev';
import isTruthy from 'lib/common/isTruthy';
const isServer = typeof window === 'undefined';

export default class LoginStore {
  // accessToken으로 받아오는 info
  @observable loginInfo = {};

  // 로그인 상태값. 처음부터 자동로그인을 시도하므로 LOGIN_IN_PROGRESS을 초기값으로 둔다.
  @observable loginStatus = loginStatus.LOGIN_IN_PROGRESS;

  // 로그인 되었는지
  @computed get isLoggedIn() {
    return (
      this.loginStatus === loginStatus.LOGIN_DONE &&
      !!_.get(this, 'loginInfo.userId')
    );
  }

  /**
   * 로그인, 로그아웃 여부를 결정하는 과정이 완료되었는데.
   * 로그인/로그아웃 버튼처럼 로그인 여부에 따라 상태가 바뀌는 버튼은 로그인 과정이 모두 완료된 후 보여줘야 한다.
   */
  @computed
  get isLoginProcessDone() {
    return this.loginStatus !== loginStatus.LOGIN_IN_PROGRESS;
  }
  // user의 실제 정보
  @observable userInfo = {};

  constructor(root) {
    if (!isServer) {
      this.root = root;
      this.autoLogin();
    }
  }
  /**
   * 로그인 성공 후 데이터 처리
   * API 인스턴스에 토큰을 업데이트 하고 유저 정보를 가져온다.
   */
  @action
  handleLoginSuccess = ({ accessToken, refreshToken, expiresIn }) => {
    API.updateAccessToken({ accessToken, refreshToken, expiresIn });
    this.handleSuccessGetAccessToken(accessToken);
  };

  /**
   * 자동 로그인 진행
   */
  @action
  autoLogin = async () => {
    // 브라우저에서만 진행함
    if (isServer) {
      return;
    }
    try {
      this.setLoginStatus(loginStatus.LOGIN_IN_PROGRESS); // 로그인 프로세스 진행중

      const accessToken = Cookies.get(key.ACCESS_TOKEN);
      const refreshToken = Cookies.get(key.REFRESH_TOKEN);

      if (!refreshToken || refreshToken === 'undefined') {
        // 토큰이 없으므로 로그아웃 처리
        // Cookies.remove(key.ACCESS_TOKEN);
        // Cookies.remove(key.REFRESH_TOKEN);
        this.setLoginStatus(loginStatus.LOGOUT);
      } else if (accessToken) {
        // 발급된 토큰으로 다음 과정 진행
        this.handleSuccessGetAccessToken(accessToken);
      } else if (refreshToken) {
        // 토큰 재발급
        await API.refreshAccessToken().then(({ access_token }) => {
          // devLog('토큰 재발급', access_token);
          if (access_token) {
            this.handleSuccessGetAccessToken(access_token);
          }
        });
      } else {
        this.logout();
      }
    } catch (e) {
      console.dir(e);
      console.error(e);
      this.logout();
    } finally {
      console.groupEnd(`autoLogin`);
    }
  };

  /**
   * access token 가져오기 성공. 토큰에서 로그인 정보를 추출하고 유저 정보를 가져온다.
   */
  handleSuccessGetAccessToken = async (accessToken) => {
    try {
      this.decodeLoginData(accessToken);
      this.setLoginStatus(loginStatus.LOGIN_DONE);
      // devLog(`Bearer ${accessToken}`);
    } catch (e) {
      // this.logout();
      console.error(e);
    } finally {
      console.groupEnd(`handleSuccessGetAccessToken`);
    }
  };

  @action
  setLoginStatus = (status) => {
    this.loginStatus = status;
  };

  /**
   * access token 으로 로그인 정보를 파싱함.
   * 파싱된 데이터에서 가져온 유저 아이디로 유저 정보 가져오기
   *
   * @returns {object} loginInfo
   */
  @action
  decodeLoginData = (accessToken) => {
    let loginInfoKey;

    if (accessToken) {
      loginInfoKey = accessToken.split('.');
    }

    if (isBrowser && Array.isArray(loginInfoKey)) {
      const parsedloginInfo = JSON.parse(window.atob(loginInfoKey[1]));

      this.loginInfo = parsedloginInfo;

      const { userId } = parsedloginInfo;

      this.root.user.getUserInfo({ userId });

      // 와이더플래닛 로그인
      widerplanetTracker.signIn({
        userId,
      });

      return parsedloginInfo;
    } else {
      return null;
    }
  };

  @action
  logout = () => {
    devLog(`LoginStore.logout`);

    // API 콜에 사용하는 토큰 제거
    API.removeAccessToken();

    // 유저 데이터 초기화
    this.loginInfo = {};
    this.root.user.userInfo = {};

    // 스토리지 데이터 제거
    localStorage.remove(key.GUHADA_USERINFO);
    sessionStorage.remove(key.PW_DOUBLE_CHECKED);

    // 상태 값 변경
    this.setLoginStatus(loginStatus.LOGOUT);

    // 비밀번호 중복체크 상태 해제
    this.root.user.setPasswordDoubleChecked(false);
    this.root.shoppingcart.cartAmount = 0;
    // 홈 화면으로 이동
    // Router.push(`/`);
  };

  @observable email;
  @observable profileJson;
  @observable snsId;
  @observable snsType;
  @observable loginPosition;
  @observable showEditForm = false;
  /**
   * 페이스북 로그인 성공 결과에서 데이터 추출
   */
  extractFacebookLoginParams = (data) => {
    return {
      email: data.email,
      profileJson: data,
      snsId: data.id,
      snsType: snsTypes.FACEBOOK,
    };
  };

  @action
  responseFacebook = (response) => {
    let data = response;
    let login = this;

    const {
      email,
      profileJson,
      snsId,
      snsType,
    } = this.extractFacebookLoginParams(data);

    this.email = email;
    this.profileJson = profileJson;
    this.snsId = snsId;
    this.snsType = snsType;

    API.user
      .get('/users/sns', {
        params: {
          email: this.email,
          'sns-type': this.snsType,
          uid: this.snsId,
        },
      })
      .then(function(res) {
        let data = res.data;
        if (data.resultCode === 200) {
          login.loginFacebook();
        }
      })
      .catch((e) => {
        console.error(e);
        devLog('e.status', e.status);
        if (e.status === 200) {
          if (_.get(e, 'data.resultCode') === 5004) {
            if (login.loginPosition === 'luckydrawSNS') {
              login.root.luckyDraw.setLuckydrawSignupModal(true);
            } else {
              pushRoute('/login/termagreesns');
            }
          } else if (_.get(e, 'data.resultCode') === 6001) {
            this.root.alert.showAlert(_.get(e, 'data.message'));
          }
        } else {
        }
      });
  };

  @action
  loginFacebook = (email = '') => {
    let login = this;
    let savedPointResponse = sessionStorage.get('signup');
    entryService
      .facebookLogin({
        email: this.email,
        profileJson: this.profileJson,
        snsId: this.snsId,
        snsType: this.snsType,
      })
      .then(function(res) {
        let data = res.data;
        devLog(data);

        Cookies.set(key.ACCESS_TOKEN, data.data.accessToken);
        Cookies.set(key.REFRESH_TOKEN, data.data.refreshToken);

        login.handleLoginSuccess({
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          expiresIn: data.data.expiresIn,
        });
        if (login.loginPosition === 'luckydrawSNS') {
          login.root.luckyDraw.getEventUser();
          login.root.luckyDraw.setLuckydrawLoginModal(false);
          login.root.luckyDraw.setLuckydrawSignupModal(false);
        } else if (isTruthy(savedPointResponse)) {
          Router.push('/');
        } else {
          pushRoute(Router.query.redirectTo || '/');
        }
      })
      .catch((e) => {
        devLog('e', e);
      });
  };

  /**
   * 구글 로그인 성공 결과에서 데이터 추출
   */
  extractGoogleLoginParams = (data) => {
    return {
      email: data.profileObj?.email,
      profileJson: data.profileObj,
      snsId: data.profileObj?.googleId,
      snsType: snsTypes.GOOGLE,
    };
  };

  @action
  responseGoogle = (response) => {
    devLog('google', response);
    let data = response;
    let login = this;

    const {
      email,
      profileJson,
      snsId,
      snsType,
    } = this.extractGoogleLoginParams(data);

    this.email = email;
    this.profileJson = profileJson;
    this.snsId = snsId;
    this.snsType = snsType;

    API.user
      .get('/users/sns', {
        params: {
          email: this.email,
          'sns-type': this.snsType,
          uid: this.snsId,
        },
      })
      .then(function(res) {
        let data = res.data;
        if (data.resultCode === 200) {
          login.loginGoogle();
        }
      })
      .catch((e) => {
        console.error(e);
        devLog('e.status', e.status);
        if (e.status === 200) {
          if (_.get(e, 'data.resultCode') === 5004) {
            if (login.loginPosition === 'luckydrawSNS') {
              login.root.luckyDraw.setLuckydrawSignupModal(true);
            } else {
              pushRoute('/login/termagreesns');
            }
          } else if (_.get(e, 'data.resultCode') === 6001) {
            this.root.alert.showAlert(_.get(e, 'data.message'));
          }
        } else {
        }
      });
  };

  @action
  loginGoogle = (email = '') => {
    let login = this;
    let savedPointResponse = sessionStorage.get('signup');
    entryService
      .googleLogin({
        email: this.email,
        profileJson: this.profileJson,
        snsId: this.snsId,
        snsType: this.snsType,
      })
      .then(function(res) {
        let data = res.data;
        Cookies.set(key.ACCESS_TOKEN, data.data.accessToken);
        Cookies.set(key.REFRESH_TOKEN, data.data.refreshToken);

        login.handleLoginSuccess({
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          expiresIn: data.data.expiresIn,
        });
        if (login.loginPosition === 'luckydrawSNS') {
          login.root.luckyDraw.getEventUser();
          login.root.luckyDraw.setLuckydrawLoginModal(false);
          login.root.luckyDraw.setLuckydrawSignupModal(false);
        } else if (isTruthy(savedPointResponse)) {
          Router.push('/');
        } else {
          pushRoute(Router.query.redirectTo || '/');
        }
      })
      .catch((e) => {
        devLog('e', e);
      });
  };

  /**
   * 카카오 로그인 성공 결과에서 데이터 추출
   */
  extractKakaoLoginParams = (data) => {
    return {
      email: data.profile?.kakao_account?.email,
      profileJson: data.profile?.properties,
      snsId: data.profile?.id,
      snsType: snsTypes.KAKAO,
    };
  };

  @action
  responseKakao = (response) => {
    devLog('kakao', response);
    let data = response;
    let login = this;

    const { email, profileJson, snsId, snsType } = this.extractKakaoLoginParams(
      data
    );

    this.email = email;
    this.profileJson = profileJson;
    this.snsId = snsId;
    this.snsType = snsType;

    API.user
      .get('/users/sns', {
        params: {
          email: data.profile.kakao_account.email,
          'sns-type': snsTypes.KAKAO,
          uid: data.profile.id,
        },
      })
      .then(function(res) {
        let data = res.data;
        if (data.resultCode === 200) {
          login.loginKakao();
        }
      })
      .catch((e) => {
        if (e.status === 200) {
          if (_.get(e, 'data.resultCode') === 5004) {
            if (login.loginPosition === 'luckydrawSNS') {
              login.root.luckyDraw.setLuckydrawSignupModal(true);
            } else {
              pushRoute('/login/termagreesns');
            }
          } else if (_.get(e, 'data.resultCode') === 6001) {
            this.root.alert.showAlert(_.get(e, 'data.message'));
          }
        } else {
        }
      });
  };

  @action
  loginKakao = (email = '') => {
    let login = this;
    let savedPointResponse = sessionStorage.get('signup');
    entryService
      .kakaoLogin({
        email: this.email,
        profileJson: this.profileJson,
        snsId: this.snsId,
        snsType: this.snsType,
      })
      .then(function(res) {
        let data = res.data;
        Cookies.set(key.ACCESS_TOKEN, data.data.accessToken);
        Cookies.set(key.REFRESH_TOKEN, data.data.refreshToken);

        login.handleLoginSuccess({
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          expiresIn: data.data.expiresIn,
        });
        if (login.loginPosition === 'luckydrawSNS') {
          login.root.luckyDraw.getEventUser();
          login.root.luckyDraw.setLuckydrawLoginModal(false);
          login.root.luckyDraw.setLuckydrawSignupModal(false);
        } else if (isTruthy(savedPointResponse)) {
          Router.push('/');
        } else {
          pushRoute(Router.query.redirectTo || '/');
        }
      })
      .catch((e) => {
        devLog('e', e);
      });
  };

  /**
   * 네이버 로그인 성공 결과에서 데이터 추출
   */
  extractNaverLoginParams = (data) => {
    return {
      email: data.user.email,
      profileJson: data.user,
      snsId: data.user.id,
      snsType: snsTypes.NAVER,
    };
  };

  @action
  responseNaver = (response) => {
    devLog('naver', response);
    let data = response;
    let login = this;

    const { email, profileJson, snsId, snsType } = this.extractNaverLoginParams(
      data
    );

    this.email = email;
    this.profileJson = profileJson;
    this.snsId = snsId;
    this.snsType = snsType;

    API.user
      .get('/users/sns', {
        params: {
          email: this.email,
          'sns-type': this.snsType,
          uid: this.snsId,
        },
      })
      .then(function(res) {
        let data = res.data;
        if (data.resultCode === 200) {
          login.loginNaver();
        }
      })
      .catch((e) => {
        if (e.status === 200) {
          if (_.get(e, 'data.resultCode') === 5004) {
            if (login.loginPosition === 'luckydrawSNS') {
              login.root.luckyDraw.setLuckydrawSignupModal(true);
            } else {
              pushRoute('/login/termagreesns');
            }
          } else if (_.get(e, 'data.resultCode') === 6001) {
            this.root.alert.showAlert(_.get(e, 'data.message'));
          }
        } else {
        }
      });
  };

  @action
  loginNaver = (email = '') => {
    let login = this;
    let savedPointResponse = sessionStorage.get('signup');
    entryService
      .naverLogin({
        email: this.email,
        profileJson: this.profileJson,
        snsId: this.snsId,
        snsType: this.snsType,
      })
      .then(function(res) {
        let data = res.data;
        Cookies.set(key.ACCESS_TOKEN, data.data.accessToken);
        Cookies.set(key.REFRESH_TOKEN, data.data.refreshToken);

        login.handleLoginSuccess({
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          expiresIn: data.data.expiresIn,
        });
        if (login.loginPosition === 'checkPassword') {
          pushRoute('/mypage/me');
          login.showEditForm = true;
        } else if (login.loginPosition === 'luckydrawSNS') {
          pushRoute('/event/luckydraw');
          login.root.luckyDraw.getEventUser();
          login.root.luckyDraw.setLuckydrawLoginModal(false);
          login.root.luckyDraw.setLuckydrawSignupModal(false);
        } else if (isTruthy(savedPointResponse)) {
          Router.push('/');
        } else {
          pushRoute(Router.query.redirectTo || '/');
        }
      })
      .catch((e) => {
        devLog('e', e);
      });
  };

  /**
   * 이메일, 비밀번호로 로그인 시도
   */
  // loginUser = async ({ email, password, then = () => {} }) => {
  //   try {
  //     await API.user.post(`/loginUser`, {
  //       email,
  //       password,
  //     });

  //     then();
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  /**
   * 로컬스토리지에 저장된 유저정보를 가져온다
   */
  // @action
  // setUserInfoFromStorage = () => {
  //   const userInfo = localStorage.get(key.GUHADA_USERINFO);
  //   if (userInfo) {
  //     this.userInfo = userInfo;
  //   }
  // };
}
