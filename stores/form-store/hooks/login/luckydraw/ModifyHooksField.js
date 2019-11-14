import Form from '../../../_.forms';
import _ from 'lodash';
import API from 'lib/API';
import { root } from 'store';
import { devLog } from 'lib/devLog';
import userService from 'lib/API/user/userService';
import notificationService from 'lib/API/user/notificationService';
import { isBrowser } from 'lib/isServer';
import verifyService from 'lib/API/user/verifyService';

export default {
  onInit() {
    // devLog('-> onInit field HOOK');
  },

  onSuccess(field) {
    devLog(field);
    devLog('-> onSubmit HOOK -', field.path, field.value);
    let form = Form.modifyLuckydraw;
    let value = form.values();

    if (field.path === 'emailCheck') {
      form.$('email').validate({ showErrors: true });

      if (form.$('email').hasError === false) {
        if (value.emailCheck === '') {
          if (value.emailOriginal === value.email) {
            form.$('emailCheck').set('label', '확인완료');
            form.$('emailCheck').set('value', 'complete');
          } else {
            API.user
              .get(`/isEmailExist/${value.email}`)
              .then(res => {
                form.$('emailCheck').set('label', '확인완료');
                form.$('emailCheck').set('value', 'complete');
                // form.$('emailVerifiedUpdated').set('value', true);
              })
              .catch(({ data }) => {
                if (data.resultCode === 6001)
                  form.$('email').invalidate(data.message);
              });
          }
        }
        // else if (
        //   value.emailCheck === 'success' ||
        //   value.emailCheck === 'resend'
        // ) {
        //   let countdown = root.countdown;

        //   if (value.emailCheck === 'success')
        //     countdown.setDuplicatedSendChecker();

        //   if (countdown.duplicatedSendChecker === false) {
        //     notificationService
        //       .sendEmailToVerify({ body: { email: value.email } })
        //       .then(res => {
        //         let data = res.data;
        //         countdown.seconds = data.data / 1000;
        //         countdown.startTimer();
        //         countdown.startDuplicatedSendChecker();
        //         form.$('emailCheck').set('label', '재전송');
        //         form.$('emailCheck').set('value', 'resend');
        //       })
        //       .catch(({ data }) => {});
        //   } else {
        //     root.alert.showAlert('인증번호 재발송은 발송 1분후에 가능합니다.');
        //   }
        // }
      }
    }
    // else if (field.path === 'emailAuth') {
    //   verifyService
    //     .verifyCode({
    //       body: {
    //         verificationNumber: value.verificationNumber,
    //         verificationTarget: value.email,
    //         verificationTargetType: 'EMAIL',
    //       },
    //     })
    //     .then(() => {
    //       devLog('이메일 인증성공');
    //       form.$('emailCheck').set('label', '인증완료');
    //       form.$('emailCheck').set('value', 'complete');
    //       form.$('emailVerifiedUpdated').set('value', true);
    //     })
    //     .catch(e => {
    //       root.alert.showAlert('유효하지 않은 코드입니다.');
    //     });
    // }
    else if (field.path === 'authMobileButton') {
      root.authmobile.getCertKey('luckydrawModify');
    }
  },

  onError(field) {
    devLog('field Values', field.values());
    devLog('field Errors', field.errors());
  },

  onFocus() {
    devLog('onFocus');
  },

  onToggle() {
    devLog('onToggle');
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
    let form = Form.modifyLuckydraw;

    function optionalAgree(bool) {
      form.$('agreeSaleTos').set(bool);
      form.$('agreeEmailReception').set(bool);
      form.$('agreeSmsReception').set(bool);
    }

    if (field.path === 'email') {
      form.$('emailCheck').set('label', '중복확인');
      form.$('emailCheck').clear();
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

  onBlur: field => {
    devLog('-> onBlur HOOK -', field.path, field.value);
    field.validate({ showErrors: true });
  },
};
