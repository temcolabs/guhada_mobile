import Router from 'next/router';
import Form from 'stores/form-store/_.forms';
import API from 'lib/API';
import _ from 'lodash';
import { devLog, devGroup, devGroupEnd } from 'lib/devLog';
import naverShoppingTrakers from 'lib/tracking/navershopping/naverShoppingTrakers';
import daumTrakers from 'lib/tracking/daum/daumTrakers';
import { root } from 'store';

export default {
  onInit(form) {},

  onSuccess(form) {
    devLog('Form Values', form.values());
    devLog('Form Errors', form.errors());
    let value = form.values();
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

        root.luckydraw.setLuckydrawLoginModal(false);
        root.luckydraw.getEventUser(Form.modifyLuckydraw);
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
