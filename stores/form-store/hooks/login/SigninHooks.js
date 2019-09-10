import { root } from 'store';
import API from 'lib/API';
import qs from 'qs';
import { pushRoute } from 'lib/router';
import { devLog } from 'lib/devLog';

export default {
  onInit(form) {},

  onSubmit(instance) {
    devLog(instance);
    devLog(
      '-> onSubmit HOOK -',
      instance.path || 'form',
      '- isValid?',
      instance.isValid
    );
  },

  onSuccess(form) {
    let loginData = form.values();
    devLog('Success Values', form.values());

    API.user
      .post(
        `/loginUser`,
        {
          email: loginData.email,
          password: loginData.password,
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

        console.group(`loginUser success`);
        devLog('data', data);
        console.groupEnd(`loginUser success`);

        if (resData.resultCode === 200) {
          root.login.handleLoginSuccess({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            expiresIn: data.expiresIn,
          });

          // 로그인 후 이동할 페이지가 지정되어 있는지 확인
          const query = qs.parse(window.location.search, {
            ignoreQueryPrefix: true,
          });
          const targetUrl = !!query.redirectTo ? query.redirectTo : '/';

          pushRoute(targetUrl);
        } else {
          switch (data.resultCode) {
            case 6003:
              root.toast.getToast(data.result);
              break;

            case 5004:
              root.toast.getToast(data.result);
              break;

            default:
              break;
          }
        }
      })
      .catch(function(error) {
        devLog(error);
      });
  },

  onError(form) {
    devLog('Form Values', form.values());
    devLog('Form Errors', form.errors());
    let error = form.errors();

    let dir = [error.email, error.password];
    for (let i = 0; i < dir.length; i++) {
      if (dir[i]) {
        root.toast.getToast(dir[i]);
        return;
      }
    }
  },

  onClear(instance) {
    devLog('-> onClear HOOK -', instance.path || 'form');
  },

  onReset(instance) {
    devLog('-> onReset HOOK -', instance.path || 'form');
  },
};
