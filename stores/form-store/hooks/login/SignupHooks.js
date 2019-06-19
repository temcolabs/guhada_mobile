import Axios from 'axios';
import Router from 'next/router';
import termForm from '../../_.forms';
import API from 'lib/API';

export default {
  onInit(form) {
    console.log('-> onInit Form HOOK');
  },

  onSuccess(form) {
    let loginData = form.values();
    let termData = termForm.termAgree.values();

    if (loginData.password !== loginData.passwordConfirm) {
      form.$('passwordConfirm').invalidate('비밀 번호가 동일하지 않습니다.');
      return false;
    }

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
        console.log(res.data);
        let data = res.data;

        if (data.resultCode === 200) {
          Router.push('/?signupsuccess=true&email=' + loginData.email);
        } else if (data.resultCode === 6001) {
          form.$('email').invalidate(data.data.result);
        } else if (data.resultCode === 6002) {
          form.$('password').invalidate(data.data.result);
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
