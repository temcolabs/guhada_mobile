import _ from 'lodash';
import API from 'lib/API';
import Form from '../../_.forms';
import { devLog } from 'lib/common/devLog';
import { passwordValidMessage } from 'lib/string/isValidPasswordStr';

const debounceCheckEmail = _.debounce(async (email, initiation, callback) => {
  initiation();
  try {
    const { data } = await API.user.get(`/isEmailExist/${email}`);
    if (data.result === 'SUCCESS') {
      callback(true);
    } else {
      callback(false, data.message || '다시 시도해주세요.');
    }
  } catch (error) {
    callback(false, (error.data && error.data.message) || '다시 시도해주세요.');
  }
}, 400);

const debounceValidate = _.debounce((validateFunc) => {
  validateFunc();
}, 500);

export default {
  onInit() {
    // override default bindings for all text inputs
    this.name === 'Register Material' &&
      this.each((field) => {
        field.type === 'text' && field.set('bindings', 'MaterialTextField');
      });
  },

  onSuccess(form) {
    devLog('Success Values', form.values());
    devLog('api call start', form);
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
    let form = Form.signUp;

    if (field.path === 'email') {
      form.$('emailCheck').set('value', '');
      field.validate({ showErrors: false }).then((field) => {
        if (field.value.length === 0) {
          debounceCheckEmail.cancel();
          field.validate({ showErrors: true });
        }
        if (!field.errorSync) {
          debounceCheckEmail(
            field.value,
            () => {
              form.$('emailCheck').set('value', 'loading');
            },
            (pass, message) => {
              if (pass) {
                form.$('emailCheck').set('value', '사용 가능한 이메일입니다.');
                field.validate({ showErrors: false });
              } else {
                form.$('emailCheck').set('value', '');
                field.invalidate(message);
              }
            }
          );
        } else {
          debounceCheckEmail.cancel();
          debounceValidate(() => field.validate({ showErrors: true }));
        }
      });
    }

    if (field.path === 'password') {
      debounceValidate(() => {
        const errorMessage = passwordValidMessage(field.value);
        if (errorMessage) {
          field.invalidate(errorMessage);
        } else {
          field.validate({ showErrors: true });
        }
      });
    }
    if (field.path === 'passwordConfirm') {
      debounceValidate(() => {
        field.validate({ showErrors: true });
      });
    }

    function allAgreement(bool) {
      form.$('requireAgree').set(bool);
      form.$('agreePurchaseTos').set(bool);
      form.$('agreeSaleTos').set(bool);
      form.$('optionalAgree').set(bool);
      form.$('agreeCollectPersonalInfoTos').set(bool);
      form.$('agreeEmailReception').set(bool);
      form.$('agreeSmsReception').set(bool);
    }

    function requireAgree(bool) {
      form.$('agreePurchaseTos').set(bool);
      form.$('agreeCollectPersonalInfoTos').set(bool);
    }

    function optionalAgree(bool) {
      form.$('agreeSaleTos').set(bool);
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

  onBlur(field) {
    if (
      // field.path === 'email' ||
      field.path === 'password' ||
      field.path === 'passwordConfirm'
    ) {
      field.validate({ showErrors: true });
    }
    if (field.label === '비밀번호') {
      field.errorSync = passwordValidMessage(field.value);
    }
  },
};
