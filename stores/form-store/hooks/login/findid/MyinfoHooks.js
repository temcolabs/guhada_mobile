import _ from 'lodash';
import Router from 'next/router';
import API from 'lib/API';
import { autoHypenTele, autoHypenPhone } from 'lib/utils';
import { devLog } from 'lib/common/devLog';
import { root } from 'stores';
import { pushRoute } from 'lib/router';

export default {
  onInit() {
    // override default bindings for all text inputs
    this.name === 'Register Material' &&
      this.each(
        (field) =>
          field.type === 'text' && field.set('bindings', 'MaterialTextField')
      );
  },

  onSuccess(form) {
    let idFindData = form.values();
    devLog('Success Values', form.values());
    devLog('api call start', form);

    API.user
      .post('/users/findUserId', {
        mobile: idFindData.mobile.replace(/-/gi, ''),
        name: idFindData.name,
      })
      .then(function(res) {
        devLog(res);
        let data = res.data;

        form.$('email').set(data.data.email);
        form.$('joinAt').set(data.data.joinAt);
        form.$('phoneNumber').set(data.data.phoneNumber);

        Router.push('/login/findidresult');
      })
      .catch((e) => {
        if (_.get(e, 'data.resultCode') === 5004)
          root.alert.showConfirm({
            content: '해당 정보와 일치하는 아이디가 없습니다.',
            confirmText: '가입하기',
            onConfirm: () => {
              pushRoute('/login/signup');
            },
          });
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

  onBlur: (field) => {
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
