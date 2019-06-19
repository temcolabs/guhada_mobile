import Cookies from 'js-cookie';
import { root } from 'store';
import API from 'lib/API';
import qs from 'qs';
import { pushRoute } from 'lib/router';

export default {
  onInit(form) {},

  onSubmit(instance) {
    console.log(instance);
    console.log(
      '-> onSubmit HOOK -',
      instance.path || 'form',
      '- isValid?',
      instance.isValid
    );
  },

  onSuccess(form) {
    let loginData = form.values();
    console.log('Success Values', form.values());

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
        console.log('data', data);
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
              form.$('password').invalidate(data.result);
              break;

            case 5004:
              form.$('email').invalidate(data.result);
              break;

            default:
              break;
          }
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  },

  onError(form) {
    console.log('Form Values', form.values());
    console.log('Form Errors', form.errors());
  },

  onClear(instance) {
    console.log('-> onClear HOOK -', instance.path || 'form');
  },

  onReset(instance) {
    console.log('-> onReset HOOK -', instance.path || 'form');
  },
};
