import Router from 'next/router';
import Form from 'stores/form-store/_.forms';
import API from 'childs/lib/API';
import _ from 'lodash';
import { devLog, devGroup, devGroupEnd } from 'childs/lib/common/devLog';
import naverShoppingTrakers from 'childs/lib/tracking/navershopping/naverShoppingTrakers';
import daumTracker from 'childs/lib/tracking/daum/daumTracker';
import { root } from 'store';

export default {
  onInit(form) {},

  onSuccess(form) {
    devLog('Form Values', form.values());
    devLog('Form Errors', form.errors());
    let value = form.values();
    let body = {
      identityVerify: {
        birth: value.birth,
        diCode: value.diCode,
        gender: value.gender,
        identityVerifyMethod: 'MOBILE',
        mobile: value.mobile,
        name: value.name,
      },
      userSignUp: {
        agreeCollectPersonalInfoTos: value.agreeCollectPersonalInfoTos,
        agreeEmailReception: value.agreeEmailReception,
        agreePurchaseTos: value.agreePurchaseTos,
        agreeSaleTos: value.agreeSaleTos,
        agreeSmsReception: value.agreeSmsReception,
        email: value.email,
        password: value.password,
      },
    };
    API.user
      .post(`/event/users`, body)
      .then(res => {
        API.user
          .post(
            `/loginUser`,
            {
              email: value.email,
              password: value.password,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          .then(function(res) {
            const { data: resData } = res;
            const { data } = resData;

            devGroup(`loginUser success`);
            devGroupEnd(`loginUser success`);

            root.login.handleLoginSuccess({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              expiresIn: data.expiresIn,
            });

            root.luckyDraw.setLuckydrawSignupModal(false);
            // root.alert.showAlert('럭키드로우 시도');
            root.luckyDraw.getEventUser();
          })
          .catch(e => {
            const data = _.get(e, 'data') || {};

            switch (data?.resultCode) {
              case 6003:
                form.$('password').invalidate(data.message);
                break;

              case 5004:
                form.$('email').invalidate(data.message);
                break;

              case 6016:
                root.alert.showAlert(data.message);
                break;

              case 6500:
                root.alert.showAlert(data.message);
                break;

              default:
            }
          });
      })
      .catch(err => {
        let resultCode = _.get(err, 'data.resultCode');
        let message = _.get(err, 'data.message');
        devLog(resultCode, message, 'message', 'resultCode');
        if (resultCode) {
          root.alert.showAlert({
            content: message,
          });
        } else {
          root.alert.showAlert({
            content: '회원가입 실패',
          });
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
};
