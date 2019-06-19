import Axios from 'axios';
import Router from 'next/router';
import API from 'lib/API';
import Form from '../../../_.forms';
import { autoHypenTele, autoHypenPhone } from 'utils';
import { root } from 'store';
import { toJS } from 'mobx';

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
    let form = Form.findPasswordMobile;
    console.log(field);
    console.log('-> onSubmit HOOK -', field.path, field.value);

    let countdown = root.countdown;

    API.user
      .post('/verify/sendMobile', {
        email: form.values().email,
        mobile: form.values().mobile.replace(/-/gi, ''),
        name: form.values().name,
      })
      .then(res => {
        let data = res.data;

        if (data.resultCode === 200) {
          form.$('email').validate();
          form.$('name').validate();
          form.$('resendButton').set(true);
          countdown.seconds = data.data / 1000;
          countdown.startTimer();
        } else if (data.resultCode === 6005) {
          form.$('email').invalidate(data.data.result);
          form.$('name').invalidate(' ');
        }
      });
  },

  onError(field) {
    console.log('Form Values', field.values());
    console.log('Form Errors', field.errors());
  },

  onSubmit(instance) {
    console.log(
      '-> onSubmit HOOK -',
      instance.path || 'form',
      '- isValid?',
      instance.isValid
    );
  },

  onChange(field) {
    console.log('-> onChange HOOK -', field.path, field.value);

    if (field.get('type') === 'tel') {
      console.log(field.path);
      if (field.path === 'managerTelephone' || field.path === 'fax') {
        field.set(autoHypenTele(field.value));
        console.log('in');
      } else {
        console.log('out');
        field.set(autoHypenPhone(field.value));
      }
    }
  },

  onBlur: field => {
    console.log('-> onBlur HOOK -', field.path, field.value);
  },
};
