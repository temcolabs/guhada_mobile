import Router from 'next/router';
import termForm from '../../_.forms';
import API from 'lib/API';
import { root } from 'store';
import { devLog } from 'lib/devLog';

export default {
  onInit(form) {
    devLog('-> onInit Form HOOK');
  },

  onSuccess(form) {
    let loginData = form.values();
    let termData = termForm.termAgree.values();

    if (loginData.password !== loginData.passwordConfirm) {
      form.$('passwordConfirm').invalidate('비밀 번호가 동일하지 않습니다.');
      return false;
    }

    API.user
      .post('/signUpUser', {
        email: loginData.email,
        password: loginData.password,
        agreeCollectPersonalInfoTos: termData.agreeCollectPersonalInfoTos,
        agreeEmailReception: termData.agreeEmailReception,
        agreePurchaseTos: termData.agreePurchaseTos,
        agreeSaleTos: termData.agreeSaleTos,
        agreeSmsReception: termData.agreeSmsReception,
      })
      .then(function(res) {
        devLog(res.data);
        let data = res.data;

        if (data.resultCode === 200) {
          Router.push('/?signupsuccess=true&email=' + loginData.email);
        } else if (data.resultCode === 6001) {
          root.toast.getToast(data.data.result);
        } else if (data.resultCode === 6002) {
          root.toast.getToast(data.data.result);
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

  onClear(instance) {
    devLog('-> onClear HOOK -', instance.path || 'form');
  },

  onReset(instance) {
    devLog('-> onReset HOOK -', instance.path || 'form');
  },

  onChange(field) {
    // devLog("-> onChange HOOK -", field.path, field.value);
  },

  // onFocus: field => {
  //   devLog('-> onFocus HOOK -', field.path, field.value);
  // },

  onBlur: field => {
    devLog('-> onBlur HOOK -', field.path, field.value);

    // 모바일 번호 입력시
    // 숫자만 입력받도록 처리
    if (field.path === 'mobileNumber') {
      let checkMobileNumber = field.value;

      checkMobileNumber = checkMobileNumber.replace(/[^0-9]/g, '');
      field.set(checkMobileNumber);
    }
  },
};
