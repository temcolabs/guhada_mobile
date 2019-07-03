import { observable, action, toJS } from 'mobx';
import isServer, { isBrowser } from 'lib/isServer';
import sessionStorage from 'lib/sessionStorage';
import key from 'constant/key';
import API from 'lib/API';
import localStorage from 'lib/localStorage';

/**
 * 회원정보 관리
 */
export default class UserStore {
  constructor(root) {
    if (!isServer) {
      this.root = root;
    }
  }

  actionAfterUserInfoFetched = []; // 사용자 정보 가져오기 완료되었을 때 실행할 함수

  @observable userInfo = {
    address: '',
    birth: '',
    createdAt: '',
    detailAddress: '',
    email: '',
    emailVerify: false,
    gender: '',
    id: null,
    mobile: '',
    name: '',
    nickname: '',
    roadAddress: '',
    roles: [],
    userStatus: '',
    userType: '',
    withdrawalAt: '',
  };

  // 회원정보 수정을 위해 비밀번호를 한번 더 입력했는지 확인
  @observable isPasswordDoubledChecked = false;

  /**
   * 유효한 accessToken을 가지고 있는 상태에서 유저 정보를 가져온다.
   */
  @action
  getUserInfo = async ({ userId = '' }) => {
    console.group(`getUserInfo`);
    try {
      const { data } = await API.user.get(`/users/${userId}`);

      if (data.resultCode === 200) {
        console.dir(data.data); // userInfo
        this.userInfo = data.data;
        localStorage.set(key.GUHADA_USERINFO, toJS(this.userInfo), 60);

        while (this.actionAfterUserInfoFetched.length > 0) {
          const cb = this.actionAfterUserInfoFetched.pop();

          if (typeof cb === 'function') {
            cb();
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd(`getUserInfo`);
    }
  };

  @action
  addFetched = fn => {
    this.actionAfterUserInfoFetched = this.actionAfterUserInfoFetched.concat(
      fn
    );
  };

  /**
   * 비밀번호 확인 여부는 세션 스토리지에 저장해둔다.
   */
  @action
  checkPasswordDoubleChecked = () => {
    if (isBrowser) {
      const isDoubleChecked = Boolean(
        sessionStorage.get(key.PW_DOUBLE_CHECKED)
      );
      this.setPasswordDoubleChecked(isDoubleChecked);
    }
  };

  @action
  setPasswordDoubleChecked = (isOk = false) => {
    if (isOk) {
      this.isPasswordDoubledChecked = true;
      sessionStorage.set(key.PW_DOUBLE_CHECKED, true);
    } else {
      this.isPasswordDoubledChecked = false;
      sessionStorage.set(key.PW_DOUBLE_CHECKED, false);
    }
  };
}
