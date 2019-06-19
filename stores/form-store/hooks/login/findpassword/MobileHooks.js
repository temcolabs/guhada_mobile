import Axios from 'axios';
import Router from 'next/router';
import API from 'lib/API';

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
    let Data = form.values();
    console.log('Success Values', form.values());
    console.log('api call start', form);

    API.user
      .post('/verify', {
        verificationTarget: form.values().mobile.replace(/-/gi, ''),
        verificationTargetType: 'MOBILE',
        verificationNumber: form.values().verificationNumber,
      })
      .then(function(res) {
        console.log(res);
        let data = res.data;

        if (data.resultCode === 200) {
          form.$('email').validate();
          form.$('name').validate();
          form.$('verificationNumber').validate();
          Router.push('/login/findpasswordresult');
        } else {
          form.$('verificationNumber').invalidate(data.data.result);
        }
      });
  },

  onError(form) {
    console.log('Form Values', form.values());
    console.log('Form Errors', form.errors());
  },

  onSubmit(instance) {
    console.log(
      '-> onSubmit HOOK -',
      instance.path || 'form',
      '- isValid?',
      instance.isValid
    );
  },

  onClear(instance) {
    console.log('-> onClear HOOK -', instance.path || 'form');
  },

  onReset(instance) {
    console.log('-> onReset HOOK -', instance.path || 'form');
  },

  onChange(field) {
    console.log('-> onChange HOOK -', field.path, field.value);

    let checkMobileNumber = field.value;

    checkMobileNumber = checkMobileNumber.replace(/[^0-9]/g, '');
    field.set(checkMobileNumber);
  },

  // onFocus: field => {
  //   console.log('-> onFocus HOOK -', field.path, field.value);
  // },

  onBlur: field => {
    console.log('-> onBlur HOOK -', field.path, field.value);

    // 모바일 번호 입력시
    // 숫자만 입력받도록 처리
    if (field.path === 'mobileNumber') {
      let checkMobileNumber = field.value;

      checkMobileNumber = checkMobileNumber.replace(/[^0-9]/g, '');
      field.set(checkMobileNumber);
    }
  },
};
