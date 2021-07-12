import API from 'lib/API';
import Form from '../../../_.forms';
import { root } from 'store';
import autoTelNumber from 'lib/common/autoTelNumber';
import { devLog } from 'lib/common/devLog';
import _ from 'lodash';

export default {
  onInit() {
    // override default bindings for all text inputs
    this.name === 'Register Material' &&
      this.each(
        (field) =>
          field.type === 'text' && field.set('bindings', 'MaterialTextField')
      );
  },

  onSuccess(field) {
    let form = Form.findPasswordMobile;
    devLog(field);
    devLog('-> onSubmit HOOK -', field.path, field.value);

    let countdown = root.countdown;

    if (countdown.duplicatedSendChecker === false) {
      API.user
        .post('/verify/sendMobile', {
          // email: form.values().email,
          mobile: form.values().mobile.replace(/-/gi, ''),
          name: form.values().name,
        })
        .then((res) => {
          let data = res.data;

          if (data.resultCode === 200) {
            form.$('email').validate();
            form.$('name').validate();
            form.$('resendButton').set(true);
            countdown.seconds = data.data / 1000;
            countdown.startTimer();
            countdown.startDuplicatedSendChecker();
          } else if (data.resultCode === 6005) {
          }
        })
        .catch((e) => {
          form.$('email').invalidate(' ');
          form.$('mobile').invalidate(_.get(e, 'data.message'));
          form.$('name').invalidate(' ');
        });
    } else {
      root.alert.showAlert('인증번호 재발송은 발송 1분후에 가능합니다.');
    }
  },

  onError(field) {
    devLog('Form Values', field.values());
    devLog('Form Errors', field.errors());
  },

  onSubmit(instance) {
    devLog(
      '-> onSubmit HOOK -',
      instance.path || 'form',
      '- isValid?',
      instance.isValid
    );
  },

  onChange(field) {
    devLog('-> onChange HOOK -', field.path, field.value);

    autoTelNumber(field);
  },

  onBlur: (field) => {
    devLog('-> onBlur HOOK -', field.path, field.value);
  },
};
