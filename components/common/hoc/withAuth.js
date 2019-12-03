import React from 'react';
import { pushRoute } from 'childs/lib/router';
import { inject, observer } from 'mobx-react';
import { loginStatus } from 'childs/lib/constant';
import { isBrowser } from 'childs/lib/common/isServer';
import Loading from '../loading/Loading';
import qs from 'qs';
import { devLog } from 'childs/lib/common/devLog';
import _ from 'lodash';
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
        const { login, router } = this.props;
        const { loginStatus: status } = login;

        // const isRedirectRequired = isAuthRequired
        //   ? status === loginStatus.LOGOUT
        //   : status === loginStatus.LOGIN_DONE;

        // const isVisible = isAuthRequired
        //   ? status === loginStatus.LOGIN_DONE
        //   : status === loginStatus.LOGOUT;

        // 페이지 이동 결정
        const isRedirectRequired = _.isNil(isAuthRequired)
          ? false
          : isAuthRequired === true
          ? status === loginStatus.LOGOUT // 인증이 필요한 페이지에 로그아웃 상태로 접근
          : status === loginStatus.LOGIN_DONE; // 인증이 필요없는 페이지에 로그인 완료된 상태로

        const isVisible = _.isNil(isAuthRequired)
          ? true
          : isAuthRequired === true
          ? status === loginStatus.LOGIN_DONE
          : status === loginStatus.LOGOUT;

        if (isRedirectRequired && isBrowser) {
          // const query = qs.parse(window.location.search, {
          //   ignoreQueryPrefix: true,
          // });
          // const targetUrl = !!query.redirectTo ? query.redirectTo : redirectTo;

          // devLog('[withAuth] redirect to', targetUrl);

          // pushRoute(targetUrl);
          const targetUrl = isAuthRequired // 이동시킬 페이지는 인증필요 여부에 따라 달라짐
            ? redirectTo ||
              // 인증이 필요한 페이지라면 로그인 페이지로 이동이 기본 동작
              `/login?${qs.stringify({ redirectTo: router.asPath })}`
            : redirectTo ||
              // 인증이 필요하지 않은 페이지라면 홈으로 이동이 기본 동작
              '/';

          pushRoute(targetUrl, { isReplace: true });
        }

        return isVisible ? <WrappedComponent {...this.props} /> : <Loading />;
      }
    }

    ComponentWithAuth.getInitialProps = WrappedComponent.getInitialProps;

    return ComponentWithAuth;
  };
}

export default withAuth;
