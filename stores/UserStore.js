import { observable, action, computed, toJS } from 'mobx';
import isServer, { isBrowser } from 'lib/isServer';
import sessionStorage from 'lib/sessionStorage';
import key from 'constant/key';
import API from 'lib/API';
import localStorage from 'lib/localStorage';
import _ from 'lodash';
import isFunction from 'lib/isFunction';
/**
 * 회원정보 관리
 */
export default class UserStore {
  constructor(root) {
    if (!isServer) {
      this.root = root;
    }
  }

  jobForUseInfo = []; // 사용자 정보 가져오기 완료되었을 때 실행할 함수

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

  @computed
  get userId() {
    return _.get(this.userInfo, 'id');
  }

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

        this.runJobsForUserInfo(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd(`getUserInfo`);
    }
  };

  @computed
  get userId() {
    return _.get(this.userInfo, 'id');
  }

  @action
  addFetched = fn => {
    this.jobForUseInfo = this.jobForUseInfo.concat(fn);
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

  /**
   * 유저 정보를 가져오는 API 호출이 성공한 후 실행할 함수를 저장해둔다.
   * 앱이 실행될 시점에는 유저 데이터 없기 때문이다.
   */
  @action
  pushJobForUserInfo = job => {
    if (isFunction(job)) {
      if (_.isNil(this.userId)) {
        this.jobForUseInfo.push(job);
      } else {
        job();
      }
    } else {
      console.error('[pushJobForUserInfo] job is not function');
    }
  };

  @action
  runJobsForUserInfo = (userInfo = {}) => {
    while (this.jobForUseInfo.length > 0) {
      const cb = this.jobForUseInfo.pop();
      if (typeof cb === 'function') {
        cb();
      }
    }
  };
}
