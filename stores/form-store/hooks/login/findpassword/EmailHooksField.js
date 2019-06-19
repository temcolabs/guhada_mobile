import Axios from 'axios';
import API from 'lib/API';
import { root } from 'store';
import Form from '../../../_.forms';

export default {
  onInit() {
    // override default bindings for all text inputs
    this.name === 'Register Material' &&
      this.each(
        field =>
          field.type === 'text' && field.set('bindings', 'MaterialTextField')
      );
  },

  onSuccess(field) {
    let form = Form.findPasswordEmail;
    let data = form.values();
    console.log(field);
    console.log('-> onSubmit HOOK -', field.path, field.value);

    let countdown = root.countdown;

    API.user
      .post('/verify/sendEmail', { email: data.email, name: data.name })
      .then(function(res) {
        console.log(res);
        let data = res.data;

        if (data.resultCode === 200) {
          form.$('email').validate();
          form.$('name').validate();
          form.$('resendButton').set(true);
          countdown.seconds = data.data / 1000;
          countdown.startTimer();
        } else {
          form.$('email').invalidate(data.message);
          form.$('name').invalidate(' ');
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
    // console.log("-> onChange HOOK -", field.path, field.value);
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
