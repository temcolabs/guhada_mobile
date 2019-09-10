import API from 'lib/API';
import Form from '../../../_.forms';
import { root } from 'store';
import Router from 'next/router';
import { devLog } from 'lib/devLog';

export default {
  onInit() {
    // override default bindings for all text inputs
  },

  onSuccess(form) {
    devLog('Success Values', form.values());
    devLog('api call start', form);
    let formValue;

    if (Form.findPasswordEmail.values().verificationNumber !== '') {
      formValue = Form.findPasswordEmail;
    } else if (Form.findPasswordMobile.values().verificationNumber !== '') {
      formValue = Form.findPasswordMobile;
    }

    API.user
      .post('/verify/change-password', {
        email: formValue.values().email,
        newPassword: form.values().passwordConfirm,
        verificationNumber: formValue.values().verificationNumber,
      })
      .then(function(res) {
        let data = res.data;

        if (data.resultCode === 200) {
          formValue.update({
            email: [],
            verificationNumber: [],
          });

          Router.push('/login/');
        } else {
          root.toast.getToast(data.result);
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
};
