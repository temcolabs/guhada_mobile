import API from 'lib/API';
import { root } from 'store';
import Form from '../../../_.forms';
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

  onSuccess(field) {
    let form = Form.findPasswordEmail;
    let data = form.values();
    devLog(field);
    devLog('-> onSubmit HOOK -', field.path, field.value);

    let countdown = root.countdown;

    API.user
      .post('/verify/sendEmail', { email: data.email, name: data.name })
      .then(function(res) {
        devLog(res);
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
