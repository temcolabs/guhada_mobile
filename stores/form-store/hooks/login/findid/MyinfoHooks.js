import Axios from 'axios';
import Router from 'next/router';
import API from 'lib/API';
import { autoHypenTele, autoHypenPhone } from 'utils';
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
    let idFindData = form.values();
    devLog('Success Values', form.values());
    devLog('api call start', form);

    API.user
      .get(
        '/findUserId?phoneNumber=' +
          idFindData.mobile.replace(/-/gi, '') +
          '&name=' +
          idFindData.name
      )
      .then(function(res) {
        devLog(res);
        let data = res.data;

        if (data.resultCode === 200) {
          form.$('email').set(data.data.email);
          form.$('joinAt').set(data.data.joinAt);
          form.$('phoneNumber').set(data.data.phoneNumber);
          Router.push('/login/findidresult');
        } else {
          form.$('name').invalidate(' ');
          form.$('mobile').invalidate(data.data.result);
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
    devLog('-> onChange HOOK -', field.path, field.value);
    if (field.get('type') === 'tel') {
      if (field.path === 'managerTelephone' || field.path === 'fax') {
        field.set(autoHypenTele(field.value));
      } else {
        field.set(autoHypenPhone(field.value));
      }
    }
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
