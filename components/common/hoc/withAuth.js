import React from 'react';
import { pushRoute } from 'lib/router';
import { inject, observer } from 'mobx-react';
import { loginStatus } from 'constant';
import { isBrowser } from 'lib/isServer';
import Loading from '../loading/Loading';
import qs from 'qs';

/**
 * isAuthRequired 옵션에 따라 현재 페이지에서 redirectTo로 지정된 페이지로 이동시킴
 * mobx store의 데이터에 의존함
 */
function withAuth({ isAuthRequired = true, redirectTo = '/' } = {}) {
  return WrappedComponent => {
    @inject('login')
    @observer
    class ComponentWithAuth extends React.Component {
      render() {
        const { login } = this.props;
        const { loginStatus: status } = login;

        const isRedirectRequired = isAuthRequired
          ? status === loginStatus.LOGOUT
          : status === loginStatus.LOGIN_DONE;

        const isVisible = isAuthRequired
          ? status === loginStatus.LOGIN_DONE
          : status === loginStatus.LOGOUT;

        if (isRedirectRequired && isBrowser) {
          const query = qs.parse(window.location.search, {
            ignoreQueryPrefix: true,
          });
          const targetUrl = !!query.redirectTo ? query.redirectTo : redirectTo;

          console.log('[withAuth] redirect to', targetUrl);

          pushRoute(targetUrl);
        }

        return isVisible ? <WrappedComponent {...this.props} /> : <Loading />;
      }
    }

    ComponentWithAuth.getInitialProps = WrappedComponent.getInitialProps;

    return ComponentWithAuth;
  };
}

export default withAuth;
