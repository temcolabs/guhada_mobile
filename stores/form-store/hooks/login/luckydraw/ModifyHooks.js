import Form from 'stores/form-store/_.forms';
import API from 'lib/API';
import _ from 'lodash';
import { devLog } from 'lib/devLog';
import { root } from 'store';

export default {
  onInit(form) {
    // devLog('-> onInit Form HOOK');
  },

  onSuccess(form) {
    devLog('Form Values', form.values());
    devLog('Form Errors', form.errors());
    let value = form.values();
    let body = {
      acceptTerms: {
        agreeCollectPersonalInfoTos: true,
        agreeEmailReception: value.agreeEmailReception,
        agreePurchaseTos: true,
        agreeSaleTos: value.agreeSaleTos,
        agreeSmsReception: value.agreeSmsReception,
      },
      email: value.email,
      emailVerified: value.emailVerified,
      emailVerifiedUpdated: value.emailVerifiedUpdated,
      identityVerify: {
        birth: value.birth,
        diCode: value.diCode,
        gender: value.gender,
        identityVerifyMethod: 'MOBILE',
        mobile: value.mobile,
        name: value.name,
      },
      verification: {
        verificationNumber: value.verificationNumber,
        verificationTarget: value.email,
        verificationTargetType: 'EMAIL',
      },
      verifiedIdentityUpdated: value.verifiedIdentityUpdated,
    };
    API.user
      .put(`/event/users`, body)
      .then(res => {
        root.luckyDraw.luckydrawModifyModal = false;
        root.alert.showAlert('럭키드로우 시도');
      })
      .catch(err => {
        let resultCode = _.get(err, 'data.resultCode');
        let message = _.get(err, 'data.message');
        devLog(resultCode, message, 'message', 'resultCode');
        if (resultCode) {
          root.alert.showAlert({
            content: message,
          });
        } else {
          root.alert.showAlert({
            content: '회원 정보 수정 실패',
          });
        }
      });
  },

  onError(form) {
    devLog('Form Values', form.values());
    devLog('Form Errors', form.errors());
  },

  onSubmit(instance) {
    devLog(
      '-> onSubmit HOOK -',
      instance.path || 'form',
      '- isValid?',
      instance.isValid
    );
  },
};
