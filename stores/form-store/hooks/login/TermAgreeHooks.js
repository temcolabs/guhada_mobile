import Form from '../../_.forms';
import API from 'childs/lib/API';
import { root } from 'store';
import { snsTypes } from 'childs/lib/constant/sns';
import { devLog } from 'childs/lib/common/devLog';
import daumTracker from 'childs/lib/tracking/daum/daumTracker';
import naverShoppingTrakers from 'childs/lib/tracking/navershopping/naverShoppingTrakers';
import ReactPixel from 'react-facebook-pixel';
import sessionStorage from 'childs/lib/common/sessionStorage';
import gtagTracker from 'childs/lib/tracking/google/gtagTracker';
export default {
  onInit() {},

  onSuccess(form) {
    devLog('Success Values', form.values());
    devLog('api call start', form);
    let value = form.values();
    if (value.sns === true) {
      let login = root.login;

      const header = {
        'ACCEPT-VERSION': '1.1',
      };
      API.user
        .post(
          '/sns-users',
          {
            agreeCollectPersonalInfoTos: value.agreeCollectPersonalInfoTos,
            agreeEmailReception: value.agreeEmailReception,
            agreePurchaseTos: value.agreePurchaseTos,
            agreeSaleTos: value.agreeSaleTos,
            agreeSmsReception: value.agreeSmsReception,
            email: login.email,
            profileJson: login.profileJson,
            snsId: login.snsId,
            snsType: login.snsType,
          },
          { headers: header }
        )
        .then(function(res) {
          let data = res.data.data;
          naverShoppingTrakers.signup();
          daumTracker.signup();
          ReactPixel.track('CompleteRegistration', res.data);
          gtagTracker.signup('/');
          sessionStorage.set('signup', data.savedPointResponse);
          if (data.resultCode === 200) {
            if (login.snsType === snsTypes.KAKAO) {
              login.loginKakao(login.email);
            } else if (login.snsType === snsTypes.GOOGLE) {
              login.loginGoogle(login.email);
            } else if (login.snsType === snsTypes.NAVER) {
              login.loginNaver(login.email);
            } else if (login.snsType === snsTypes.FACEBOOK) {
              login.loginFacebook(login.email);
            }
          }
        })
        .catch(e => {
          console.error(e);
        });
    }
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
    let form = Form.termAgree;

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

    if (field.path === 'optionalAgree') {
      if (field.path === 'optionalAgree' && field.value === true) {
        optionalAgree(true);
      } else if (field.path === 'optionalAgree' && field.value === false) {
        optionalAgree(false);
      } else {
        form.$('optionalAgree').set(false);
      }
    }
  },
};
