import Router from 'next/router';
import Form from 'stores/form-store/_.forms';
import API from 'childs/lib/API';
import _ from 'lodash';
import { devLog, devGroup, devGroupEnd } from 'childs/lib/common/devLog';
import naverShoppingTrakers from 'childs/lib/tracking/navershopping/naverShoppingTrakers';
import daumTrakers from 'childs/lib/tracking/daum/daumTrakers';
import { root } from 'store';
import { snsTypes } from 'constant/sns';

export default {
  onInit(form) {},

  onSuccess(form) {
    devLog('Form Values', form.values());
    devLog('Form Errors', form.errors());
    let value = form.values();
    let login = root.login;
    let body = {
      identityVerify: {
        birth: value.birth,
        diCode: value.diCode,
        gender: value.gender,
        identityVerifyMethod: 'MOBILE',
        mobile: value.mobile,
        name: value.name,
      },
      snsSignUp: {
        agreeCollectPersonalInfoTos: value.agreeCollectPersonalInfoTos,
        agreeEmailReception: value.agreeEmailReception,
        agreePurchaseTos: value.agreePurchaseTos,
        agreeSaleTos: value.agreeSaleTos,
        agreeSmsReception: value.agreeSmsReception,
        email: value.email,
        profileJson: login.profileJson,
        snsId: login.snsId,
        snsType: login.snsType,
      },
    };
    API.user
      .post(`/event/sns-users`, body)
      .then(res => {
        if (login.snsType === snsTypes.KAKAO) {
          login.loginKakao(login.email);
        } else if (login.snsType === snsTypes.GOOGLE) {
          login.loginGoogle(login.email);
        } else if (login.snsType === snsTypes.NAVER) {
          login.loginNaver(login.email);
        } else if (login.snsType === snsTypes.FACEBOOK) {
          login.loginFacebook(login.email);
        }
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
            content: '회원가입 실패',
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
