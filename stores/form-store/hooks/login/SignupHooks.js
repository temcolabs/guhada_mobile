import Router from 'next/router';
import termForm from 'stores/form-store/_.forms';
import API from 'childs/lib/API';
import feedService from 'childs/lib/API/user/feedService';
import { root } from 'store';
import { devLog } from 'childs/lib/common/devLog';
import _ from 'lodash';
import daumTracker from 'childs/lib/tracking/daum/daumTracker';
import naverShoppingTrakers from 'childs/lib/tracking/navershopping/naverShoppingTrakers';
import momentTracker from 'childs/lib/tracking/kakaomoment/momentTracker';
import ReactPixel from 'react-facebook-pixel';
import gtagTracker from 'childs/lib/tracking/google/gtagTracker';
import criteoTracker from 'childs/lib/tracking/criteo/criteoTracker';
import sessionStorage from 'childs/lib/common/sessionStorage';
import qs from 'querystring';

export default {
  onInit(form) {
    // devLog('-> onInit Form HOOK');
  },

  onSuccess(form) {
    let loginData = form.values();
    let termData = termForm.termAgree.values();

    const signUpData = {
      email: loginData.email,
      password: loginData.password,
      agreeCollectPersonalInfoTos: termData.agreeCollectPersonalInfoTos,
      agreeEmailReception: termData.agreeEmailReception,
      agreePurchaseTos: termData.agreePurchaseTos,
      agreeSaleTos: termData.agreeSaleTos,
      agreeSmsReception: termData.agreeSmsReception,
    };

    // feedID 추가
    let feedId = sessionStorage.get('pid');
    if (!feedService.verifyFeedId(feedId)) {
      feedId = '';
    }

    const headers = {
      'ACCEPT-VERSION': '1.1',
    };

    API.user
      .post('/signUpUser', signUpData, { headers })
      .then(function(res) {
        let data = res.data.data;

        // feedId post
        let userId = data.userId;
        if (userId && feedId) {
          API.user
            .post(
              `/feeds/${userId}`,
              qs.stringify({
                userId,
                feedId,
              }),
              {
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
              }
            )
            .catch(() => {
              console.error('[ERROR] error sending feedId');
            });
        }

        sessionStorage.set('signup', data.savedPointResponse);

        try {
          naverShoppingTrakers.signup();
          daumTracker.signup();
          momentTracker.signup();
          ReactPixel.track('CompleteRegistration', res.data);
          gtagTracker.signup('/');
          criteoTracker.signUpUser(loginData.email);
        } catch (error) {
          console.error('[tracker]', error.message);
        }

        Router.push('/');
      })
      .catch(e => {
        let data = _.get(e, 'data');
        if (data.resultCode === 6001) {
          root.toast.getToast(data.message);
        } else if (data.resultCode === 6002) {
          root.toast.getToast(data.message);
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
