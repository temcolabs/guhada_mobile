import Axios from 'axios';
import Router from 'next/router';
import Form from '../../_.forms';

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
    console.log('Success Values', form.values());
    console.log('api call start', form);
    Router.push('/login/signupseller');
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

    let form = Form.termSeller;

    function allAgreement(bool) {
      form.$('requireAgree').set(bool);
      form.$('optionalAgree').set(bool);
      form.$('agreePurchaseTos').set(bool);
      form.$('agreeSaleTos').set(bool);
      form.$('agreeCollectPersonalInfoTos').set(bool);
      form.$('agreeEmailReception').set(bool);
      form.$('agreeSmsReception').set(bool);
    }

    function requireAgree(bool) {
      form.$('agreePurchaseTos').set(bool);
      form.$('agreeCollectPersonalInfoTos').set(bool);
      form.$('agreeSaleTos').set(bool);
    }

    function optionalAgree(bool) {
      form.$('agreeEmailReception').set(bool);
      form.$('agreeSmsReception').set(bool);
    }

    if (field.path === 'allagree_term')
      if (field.path === 'allagree_term' && field.value === true) {
        allAgreement(true);
      } else if (field.path === 'allagree_term' && field.value === false) {
        allAgreement(false);
      } else {
        form.$('allagree_term').set(false);
      }

    if (field.path === 'requireAgree')
      if (field.path === 'requireAgree' && field.value === true) {
        requireAgree(true);
      } else if (field.path === 'requireAgree' && field.value === false) {
        requireAgree(false);
      } else {
        form.$('requireAgree').set(false);
      }

    if (field.path === 'optionalAgree')
      if (field.path === 'optionalAgree' && field.value === true) {
        optionalAgree(true);
      } else if (field.path === 'optionalAgree' && field.value === false) {
        optionalAgree(false);
      } else {
        form.$('optionalAgree').set(false);
      }
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
