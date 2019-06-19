import { computed, observable, action, toJS } from 'mobx';
import Cookies from 'js-cookie';
import API from 'lib/API';
import localStorage from 'lib/localStorage';
import sessionStorage from 'lib/sessionStorage';
import Router from 'next/router';
import { loginStatus } from 'constant';
import key from 'constant/key';
import { isBrowser } from 'lib/isServer';

const isServer = typeof window === 'undefined';

export default class LoginStore {
  @observable facebookKey = '';
  @observable googleKey = '';
  @observable kakaoKey = '';
  @observable naverKey = '';

  // accessToken으로 받아오는 info
  @observable loginInfo = {};

  // 로그인 상태값. 처음부터 자동로그인을 시도하므로 LOGIN_IN_PROGRESS을 초기값으로 둔다.
  @observable loginStatus = loginStatus.LOGIN_IN_PROGRESS;

  @computed get isLoggedIn() {
    return this.loginStatus === loginStatus.LOGIN_DONE;
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
   * 이메일, 비밀번호로 로그인 시도
   */
  loginUser = async ({ email, password, then = () => {} }) => {
    try {
      await API.user.post(`/loginUser`, {
        email,
        password,
      });

      then();
    } catch (e) {
      console.error(e);
    }
  };

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

    console.group(`autoLogin`);
    try {
      this.setLoginStatus(loginStatus.LOGIN_IN_PROGRESS); // 로그인 프로세스 진행중

      const accessToken = Cookies.get(key.ACCESS_TOKEN);
      const refreshToken = Cookies.get(key.REFRESH_TOKEN);

      if (
        !accessToken ||
        !refreshToken ||
        accessToken === 'undefined' ||
        refreshToken === 'undefined'
      ) {
        // 토큰이 없으므로 로그아웃 처리
        Cookies.remove(key.ACCESS_TOKEN);
        Cookies.remove(key.REFRESH_TOKEN);
        this.setLoginStatus(loginStatus.LOGOUT);
      } else if (accessToken) {
        // 발급된 토큰으로 다음 과정 진행
        this.handleSuccessGetAccessToken(accessToken);
      } else if (refreshToken) {
        // 토큰 재발급
        const { accessToken } = await API.refreshAccessToken();
        this.handleSuccessGetAccessToken(accessToken);
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
  handleSuccessGetAccessToken = async accessToken => {
    console.group(`handleSuccessGetAccessToken`);

    try {
      this.decodeLoginData(accessToken);
      this.setLoginStatus(loginStatus.LOGIN_DONE);
    } catch (e) {
      this.logout();
      console.error(e);
    } finally {
      console.groupEnd(`handleSuccessGetAccessToken`);
    }
  };

  /**
   * 로컬스토리지에 저장된 유저정보를 가져온다
   */
  @action
  setUserInfoFromStorage = () => {
    const userInfo = localStorage.get(key.GUHADA_USERINFO);
    if (userInfo) {
      this.userInfo = userInfo;
    }
  };

  @action
  setLoginStatus = status => {
    this.loginStatus = status;
  };

  /**
   * access token 으로 로그인 정보를 파싱함.
   * 파싱된 데이터에서 가져온 유저 아이디로 유저 정보 가져오기
   *
   * @returns {object} loginInfo
   */
  @action
  decodeLoginData = accessToken => {
    let loginInfoKey;

    if (accessToken) {
      loginInfoKey = accessToken.split('.');
    }

    if (isBrowser && Array.isArray(loginInfoKey)) {
      const parsedloginInfo = JSON.parse(window.atob(loginInfoKey[1]));

      this.loginInfo = parsedloginInfo;

      const { userId } = parsedloginInfo;

      this.root.user.getUserInfo({ userId });

      return parsedloginInfo;
    } else {
      return null;
    }
  };

  @action
  logout = () => {
    console.log(`LoginStore.logout`);

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

    // 홈 화면으로 이동
    Router.push(`/`);
  };
}
