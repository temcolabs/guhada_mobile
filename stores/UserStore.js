import { observable, action, computed, toJS } from 'mobx';
import isServer, { isBrowser } from 'childs/lib/common/isServer';
import sessionStorage from 'childs/lib/common/sessionStorage';
import key from 'constant/key';
import API from 'childs/lib/API';
import localStorage from 'childs/lib/common/localStorage';
import _ from 'lodash';
import isFunction from 'lib/isFunction';
import widerplanetTracker from 'childs/lib/tracking/widerplanet/widerplanetTracker';
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
    id: undefined, // number;
    email: undefined, // string;
    name: undefined, // any;
    userType: undefined, // string;
    emailVerify: undefined, // boolean;
    nickname: undefined, // string;
    mobile: undefined, // any;
    profileImageUrl: undefined, // any;
    zip: undefined, // any;
    address: undefined, // any;
    roadAddress: undefined, // any;
    detailAddress: undefined, // any;
    birth: undefined, // any;
    gender: undefined, // any;
    userStatus: undefined, // string;
    withdrawalAt: undefined, // any;
    createdAt: undefined, // number;
    updatedAt: undefined, // any;
    roles: [], // * Role[]; 서비스 사용 권한
    userDetail: {
      id: undefined, // number;
      verifiedIdentity: undefined, // boolean;
      verifiedName: undefined, // any;
      identityVerifyMethod: undefined, // string;
      identityVerifiedAt: undefined, // any;
      adult: undefined, // boolean;
      adultCertificationAt: undefined, // any;
      adultCertificationExpireAt: undefined, // any;
      agreeCollectPersonalInfoTos: undefined, // boolean;
      agreeCollectPersonalInfoTosAt: undefined, // number;
      agreePurchaseTos: undefined, // boolean;
      agreePurchaseTosAt: undefined, // number;
      agreeSaleTos: undefined, // boolean;
      agreeSaleTosAt: undefined, // number;
      agreeSmsReception: undefined, // boolean;
      smsAgreementUpdatedAt: undefined, // number;
      agreeEmailReception: undefined, // boolean;
      emailAgreementUpdatedAt: undefined, // number;
      interestLocation1: undefined, // any;
      interestLocation2: undefined, // any;
      interestLocation3: undefined, // any;
      agreeSavingAccount: undefined, // boolean;
      bankCode: undefined, // any;
      bankName: undefined, // any;
      accountHolder: undefined, // any;
      accountNumber: undefined, // any;
      adultProductOpen: undefined, // boolean;
      ciCode: undefined, // any;
      diCode: undefined, // any;
      createdAt: undefined, // number;
      updatedAt: undefined, // any;
      updatedBy: undefined, // any;
    },
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

        /**
         * 와이더플래닛 로그인 전환 트래커
         * 회원정보 가져왔음 = 로그인 되었음을 의미.
         */
        widerplanetTracker.signIn({ userId });
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd(`getUserInfo`);
    }
  };

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
        job(this.userInfo);
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
        cb(userInfo);
      }
    }
  };
}
