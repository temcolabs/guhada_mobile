import { Component } from 'react';
import { pushRoute } from 'lib/router';
import { withRouter } from 'next/router';
import { inject, observer } from 'mobx-react';
import { loginStatus } from 'lib/constant';
import { isBrowser } from 'lib/common/isServer';
import Loading from '../loading/Loading';
import qs from 'qs';

/**
 * isAuthRequired 옵션에 따라 현재 페이지에서 redirectTo로 지정된 페이지로 이동시킴
 * mobx store의 데이터에 의존함
 *
 * * 로그인 여부에 상관없이 보여줄 페이지에는 사용할 필요없음.
 *
 * @param isAuthRequired 래핑된 컴포넌트가 인증이 필요한지.
 *        * true  : 인증 필요 && 인증 안됨 => 다른 페이지로 리다이렉트(ex. 마이페이지)
 *        * false : 인증 미필요 && 인증됨 => 다른 페이지로 리다이렉트(ex. 로그인 페이지)
 *        * null  : 인증 상관없음. 항상 보여줌
 * @param redirectTo 인증이 되지 않았을 때 이동시킬 페이지
 */
function withAuth({ isAuthRequired = true, redirectTo } = {}) {
  return (WrappedComponent) => {
    @withRouter
    @inject('login')
    @observer
    class ComponentWithAuth extends Component {
      render() {
        const { login, router } = this.props;
        const { loginStatus: status } = login;

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
