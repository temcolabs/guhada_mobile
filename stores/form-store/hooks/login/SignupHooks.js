import Router from 'next/router';
import termForm from 'stores/form-store/_.forms';
import API from 'childs/lib/API';
import { root } from 'store';
import { devLog } from 'childs/lib/common/devLog';
import _ from 'lodash';
import daumTracker from 'childs/lib/tracking/daum/daumTracker';
import naverShoppingTrakers from 'childs/lib/tracking/navershopping/naverShoppingTrakers';
import momentTracker from 'childs/lib/tracking/kakaomoment/momentTracker';
export default {
  onInit(form) {
    // devLog('-> onInit Form HOOK');
  },

  onSuccess(form) {
    let loginData = form.values();
    let termData = termForm.termAgree.values();

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
        naverShoppingTrakers.signup();
        daumTracker.signup();
        momentTracker.signup();

        if (data.resultCode === 200) {
          Router.push('/?signupsuccess=true&email=' + loginData.email);
        }
      })
      .catch(e => {
        let data = _.get(e, 'data');
        if (data.resultCode === 6001) {
          root.toast.getToast(data.message);
        } else if (data.resultCode === 6002) {
          root.toast.getToast(data.message);
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
