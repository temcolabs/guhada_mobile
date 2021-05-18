import API from 'childs/lib/API';
import _ from 'lodash';
import { devLog, devGroup, devGroupEnd } from 'childs/lib/common/devLog';
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

        root.luckyDraw.setLuckydrawLoginModal(false);
        root.luckyDraw.getEventUser();
      })
      .catch((e) => {
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
