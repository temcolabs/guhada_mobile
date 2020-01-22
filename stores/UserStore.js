import { observable, action, computed, toJS } from 'mobx';
import isServer, { isBrowser } from 'childs/lib/common/isServer';
import sessionStorage from 'childs/lib/common/sessionStorage';
import key from 'childs/lib/constant/key';
import API from 'childs/lib/API';
import localStorage from 'childs/lib/common/localStorage';
import _ from 'lodash';
import isFunction from 'childs/lib/common/isFunction';
import { snsTypes } from 'childs/lib/constant/sns';
import { devLog } from 'childs/lib/common/devLog';
import snsUserService from 'childs/lib/API/user/snsUserService';

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

  // 연결된 SNS 타입
  // {NAVER: false, KAKAO: false, FACEBOOK: false, GOOGLE: false}
  defaultConnectedSNS = Object.keys(snsTypes).reduce((result, snsEnum) => {
    return Object.assign(result, {
      [snsEnum]: false,
    });
  }, {});

  @observable
  connectedSNS = Object.assign({}, toJS(this.defaultConnectedSNS));

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
    try {
      const { data } = await API.user.get(`/users/${userId}`);
      this.userInfo = data.data;
      devLog('userInfo', data.data);
      localStorage.set(key.GUHADA_USERINFO, toJS(this.userInfo), 60);

      this.runJobsForUserInfo(data.data);
    } catch (e) {
      // 저장된 토큰으로 회원정보를 가져올 수 없으면 로그아웃 처리한다
      this.root.login.logout();
      console.error(e);
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

  @action
  addFetched = fn => {
    this.jobForUseInfo = this.jobForUseInfo.concat(fn);
  };

  /**
   * 회원 정보를 수정하기 위해서는 비밀번호를 한번 더 입력해야 한다.
   * 비밀번호 확인 여부는 세션 스토리지에 저장해둔다. 한번 더 입력한 상태인지 확인.
   */
  @action
  isPasswordDoubleChecked = () => {
    return Boolean(sessionStorage.get(key.PW_DOUBLE_CHECKED));
  };

  /**
   * 비밀번호 확인 여부를 설정한다.
   */
  @action
  setPasswordDoubleChecked = (isAuthed = false) => {
    if (isAuthed) {
      sessionStorage.set(key.PW_DOUBLE_CHECKED, true);
    } else {
      sessionStorage.set(key.PW_DOUBLE_CHECKED, false);
    }
  };

  /**
   * 수정 중인 유저 정보 업데이트
   */
  handleChangeUserInfoForm = (field = '', data) => {
    const updated = Object.assign({}, this.state.userInfoForm, {
      [field]: data,
    });

    devLog(`handleChangeUserInfoForm updated`, updated);

    this.setState({
      userInfoForm: updated,
    });
  };

  /**
   * 닉네임 중복 확인
   */
  handleValidateNickname = nickname => {};

  /**
   * 이메일 중복 확인
   */
  handleValidateEmail = (email = '') => {
    // TODO: 이메일 인증
    devLog(email);
  };

  /**
   * 모바일번호 중복 확인
   */
  handleValidateMobile = (mobile = '') => {
    // TODO: 휴대폰 번호 인증
    devLog(mobile);
  };

  /**
   * 입력한 2개의 비밀번호가 동일한지 확인
   */
  handleValidatePassword = () => {};

  handleChangePassword = ({ newPassword, newPasswordConfirm }) => {
    if (newPassword !== newPasswordConfirm) {
      this.props.alert.showAlert('입력한 비밀번호가 다릅니다.');
    } else {
      // TODO: change password process
    }
  };

  @action
  getMySnsTypes = async () => {
    const job = async () => {
      try {
        const snsEnums = await snsUserService.getSNSUsers({
          userId: this.userId,
        });

        if (snsEnums?.length > 0) {
          this.connectedSNS = snsEnums.reduce((result, snsEnum) => {
            return Object.assign(result, {
              [snsEnum]: true,
            });
          }, toJS(this.connectedSNS));
        }
      } catch (e) {
        this.resetMySnsTypes();
        console.error(e);
      }
    };

    this.pushJobForUserInfo(job);
  };

  resetMySnsTypes = () => {
    this.connectedSNS = Object.assign({}, toJS(this.defaultConnectedSNS));
  };
}
