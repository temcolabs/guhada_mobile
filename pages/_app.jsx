import App from 'next/app';
import Router from 'next/router';
import { initializeStore } from 'stores';
import { Provider } from 'mobx-react';
import 'styles/style.scss';
import ReactModal from 'react-modal';
import moment from 'moment';
import AlertConductor from 'components/common/modal/AlertConductor';
import AssociatedProduct from 'components/common/modal/AssociatedProduct';
import qs from 'qs';
import { isBrowser, isServer } from 'lib/common/isServer';
import widerplanetTracker from 'lib/tracking/widerplanet/widerplanetTracker';
import Cookies from 'js-cookie';
import key from 'lib/constant/key';
import getIpAddrress from 'lib/common/getIpAddrress';
import { merge as _merge } from 'lodash';
import getIsProdHost from 'lib/tracking/getIsProdHost';
import CommonHead from 'lib/components/CommonHead';
import momentTracker from 'lib/tracking/kakaomoment/momentTracker';
import ReactPixel from 'react-facebook-pixel';
import gtagTracker from 'lib/tracking/google/gtagTracker';
import Layout from 'components/layout/Layout';

moment.locale('ko');

class GuhadaMobileWeb extends App {
  static async getInitialProps(appContext) {
    const { Component, ctx } = appContext;
    const { req, asPath } = ctx;

    if (isBrowser) {
      GuhadaMobileWeb.naverShoppingTracker();
      GuhadaMobileWeb.aceCouterTracker(ctx.asPath);
    }

    let initialProps = {};

    // 컴포넌트에 getInitialProps 메소드가 선언되어 있으면 실행시킨다.
    if (Component.getInitialProps) {
      initialProps = await Component.getInitialProps(ctx);
    }

    // Get or Create the store with `undefined` as initialState
    // This allows you to set a custom default initialState
    const commonMobxState = GuhadaMobileWeb.makeCommonMobxState({
      req: ctx.req,
    });

    let initialState = {
      ...commonMobxState,
    };

    // page 컴포넌트의 getInitialProps에서 리턴한 객체에 initialState가 있다면 병합
    if (initialProps.initialState) {
      initialState = _merge(initialState, initialProps.initialState);
    }

    // Get or Create the store with `undefined` as initialState
    // This allows you to set a custom default initialState
    const mobxStore = initializeStore(initialState);

    // Provide the store to getInitialProps of pages
    appContext.ctx.mobxStore = mobxStore;

    // 현재 페이지의 URI
    const hostname = isServer ? req.headers.host : window.location.hostname;
    const fullUrl = isServer
      ? `${req.protocol}://${req.headers.host}${asPath}`
      : `${window.location.origin}${Router.asPath}`;
    const isProdHost = getIsProdHost(hostname);

    return {
      mobxStore, // 서버에서 최초 생성된 mobxStore
      initialState,
      initialProps, // 컴포넌트 intialProps
      fullUrl,
      isProdHost,
      hostname,
    };
  }

  /**
   * mobx store의 초기값 생성
   */
  static makeCommonMobxState({ req }) {
    // 사용자 ip 주소 가져오기
    let userIp = null;
    if (isServer) {
      userIp = getIpAddrress(req);
    }

    return {
      bbs: {
        article: {
          userIp,
        },
      },
    };
  }

  constructor(props) {
    super(props);

    this.mobxStore = isServer
      ? props.mobxStore // getInitialProps에서 만든 store
      : initializeStore(props.initialState); // 브라우저에서는 initialState로 만든다

    if (!isServer) {
      ReactModal.setAppElement('body');
    }
  }

  componentDidMount() {
    this.initDaumTracker();
    this.execWiderPlanetTracker();
    momentTracker.visit();
    ReactPixel.init('140872021235570');
    ReactPixel.pageView();
    gtagTracker.visit();
  }

  initDaumTracker = () => {
    // 트래킹 아이디 설정
    if (
      window.DaumConversionDctSv === undefined &&
      window.DaumConversionAccountID === undefined
    ) {
      window.DaumConversionDctSv = '';
      window.DaumConversionAccountID = 'PRV6.WiKKpak6Ml_rjmD1Q00';
    }
  };

  /**
   * 와이퍼플래닛 트래커 실행.
   * 로그인, 상품 상세, 카트, 트래커 페이지는 전환이 발생하는 곳이므로 공통 전환을 실행하지 않는다.
   */
  execWiderPlanetTracker = () => {
    const locationHasConversion = [
      /^\/login.*/, // 로그인
      /^\/productdetail.*/, // 상품 상세
      /^\/shoppingcart.*/, // 카트
      /^\/orderpaymentsuccess.*/, // 구매 완료
      /^\/event\/luckydraw.*/, // 럭키드로우
    ];

    if (isBrowser) {
      const isLocationHasConversion =
        locationHasConversion
          .map((regex) => regex.test(window.location.pathname))
          .findIndex((result) => result === true) > -1;

      if (isLocationHasConversion) {
        return;
      } else {
        if (Cookies.get(key.ACCESS_TOKEN)) {
          // 회원정보 가져와서 실행
          this.mobxStore.user.pushJobForUserInfo((userInfo) => {
            // 공통
            widerplanetTracker.common({
              userId: userInfo?.id,
            });
          });
        } else {
          // 그대로 실행
          widerplanetTracker.common();
        }
      }
    }
  };

  static naverShoppingTracker = () => {
    if (!wcs_add) var wcs_add = {};
    wcs_add['wa'] = 's_57744e5ca3ee';
    if (!_nasa) var _nasa = {};
    wcs.inflow();
    wcs_do(_nasa);
  };

  static aceCouterTracker = (asPath) => {
    if (typeof window.AM_PL !== 'undefined') {
      window.AM_PL(asPath);
    }
  };

  /**
   * next.router의 쿼리만 변경되었을 때는 Component를 다시 렌더링하지 않는다.
   * 그래서 컴포넌트의 key를 쿼리스트링을 기반으로 만들어서 강제로 다시 렌더링시킨다₩
   */
  get componentKey() {
    return qs.stringify(this.props.router.query);
  }

  render() {
    const { Component, initialProps, fullUrl, hostname } = this.props;

    return (
      <Provider {...this.mobxStore}>
        <CommonHead isRobotAllowed={getIsProdHost(hostname)}>
          {/* canonical url of current page */}
          {fullUrl && <link key="canonical" rel="canonical" href={fullUrl} />}
          {fullUrl && <meta key="og:url" property="og:url" content={fullUrl} />}
        </CommonHead>

        {initialProps.layout ? (
          <Layout
            title={initialProps.layout.title}
            scrollMemo={initialProps.layout.scrollMemo}
            keepSearchAlive={initialProps.layout.keepSearchAlive}
          >
            <Component key={this.componentKey} {...initialProps} />
          </Layout>
        ) : (
          <Component key={this.componentKey} {...initialProps} />
        )}

        <AlertConductor />

        <AssociatedProduct />
      </Provider>
    );
  }
}
export default GuhadaMobileWeb;
