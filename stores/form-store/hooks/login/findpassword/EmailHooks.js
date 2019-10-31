import Axios from 'axios';
import API from 'lib/API';
import { root } from 'store';
import Router from 'next/router';
import { devLog } from 'lib/devLog';

export default {
  onInit() {
    // override default bindings for all text inputs
    this.name === 'Register Material' &&
      this.each(
        field =>
          field.type === 'text' && field.set('bindings', 'MaterialTextField')
      );
  },

  onSuccess(form) {
    let data = form.values();
    devLog('Success Values', form.values());
    devLog('api call start', form);

    API.user
      .post('/verify', {
        verificationTarget: data.email,
        verificationTargetType: 'EMAIL',
        verificationNumber: data.verificationNumber,
      })
      .then(function(res) {
        devLog(res);
        let data = res.data;

        if (data.resultCode === 200) {
          form.$('email').validate();
          form.$('name').validate();
          form.$('verificationNumber').validate();
          Router.push('/login/findpasswordresult');
        }
      })
      .catch(function(e) {
        root.toast.getToast(_.get(e, 'data.message'));
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
