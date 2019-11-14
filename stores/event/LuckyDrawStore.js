import { observable, action, computed, toJS } from 'mobx';
import _ from 'lodash';
import API from 'lib/API';
import { isBrowser } from 'lib/isServer';
import { devLog } from 'lib/devLog';
import Form from 'stores/form-store/_.forms';
import { root } from 'store';

export default class LuckyDrawStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable user;
  @observable luckydrawLoginModal = false;
  @observable luckydrawSignupModal = false;
  @observable luckydrawModifyModal = false;

  @action
  setLuckydrawLoginModal = bool => {
    if (bool === true) {
      this.root.login.loginPosition = '';
    }
    this.luckydrawLoginModal = bool;
  };

  @action
  setLuckydrawSignupModal = bool => {
    if (bool !== true) {
      this.root.login.loginPosition = '';
    }

    this.luckydrawSignupModal = bool;
  };

  @action
  setLuckydrawModifyModal = bool => {
    if (bool !== true) {
      this.root.login.loginPosition = '';
    }

    this.luckydrawModifyModal = bool;
  };

  @action
  getEventUser = () => {
    let form = Form.modifyLuckydraw;
    form.clear();
    form.$('emailCheck').set('label', '중복확인');
    form.$('authMobileButton').set('label', '본인인증');

    API.user.get(`/event/users`).then(res => {
      this.user = res.data.data;
      devLog('toJS(this.user)', toJS(this.user));
      let identityVerify = this.user.identityVerify;
      let handleModify = false;
      let acceptTerms = this.user.acceptTerms;
      let agreeSaleTos = acceptTerms.agreeSaleTos;
      let agreeEmailReception = acceptTerms.agreeEmailReception;
      let agreeSmsReception = acceptTerms.agreeSmsReception;
      let emailVerified = this.user.emailVerified;
      let validEmail = this.user.validEmail;

      if (
        agreeSaleTos === true &&
        agreeEmailReception === true &&
        agreeSmsReception === true &&
        !!validEmail &&
        identityVerify?.identityVerifyMethod === 'MOBILE'
      ) {
        handleModify = true;
      }

      // API 호출을 통한 회원 정보 수정 로직 진입
      if (!!handleModify) {
        this.root.alert.showAlert('럭키드로우 시도');
      } else {
        this.luckydrawModifyModal = true;
        // 로직을 위한 기본 사항 바인딩
        if (!!validEmail) {
          form.$('emailOriginal').set('value', this.user.email);
          form.$('email').set('value', this.user.email);
          form.$('emailCheck').set('label', '인증완료');
          form.$('emailCheck').set('value', 'complete');
        }

        form.$('emailVerified').set('value', this.user.emailVerified);

        form
          .$('verifiedIdentityUpdated')
          .set('value', this.user.verifiedIdentityUpdated);

        // 약관 동의 바인딩

        form.$('agreeSaleTos').set('value', agreeSaleTos);
        form.$('agreeEmailReception').set('value', agreeEmailReception);
        form.$('agreeSmsReception').set('value', agreeSmsReception);

        // 이메일 인증 바인딩
        if (!!emailVerified) {
          let email = this.user.email;

          form.$('emailCheck').set('label', '인증완료');
          form.$('emailCheck').set('value', 'complete');
          form.$('email').set('value', email);
          form.$('email').set('disabled', true);
        }

        // 본인인증 바인딩
        if (identityVerify?.identityVerifyMethod === 'MOBILE') {
          form.$('name').set('value', identityVerify.name);
          form.$('mobile').set('value', identityVerify.mobile);
          form.$('gender').set('value', identityVerify.gender);
          form.$('diCode').set('value', identityVerify.diCode);
          form.$('diCodeOriginal').set('value', identityVerify.diCode);
          form.$('birth').set('value', identityVerify.birth);
          form.$('authMobileButton').set('label', '인증완료');
          form.$('authMobileButton').set('value', 'complete');
        }
      }

      this.root.login.loginPosition = '';
    });
  };
}
