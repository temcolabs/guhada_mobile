import App, { Container } from 'next/app';
import React from 'react';
import { initializeStore } from '../store';
import { Provider } from 'mobx-react';
import '../style.scss';
import ReactModal from 'react-modal';
import moment from 'moment';
import AlertConductor from 'components/common/modal/AlertConductor';
import AssociatedProduct from 'components/common/modal/AssociatedProduct';
import 'react-dates/initialize';
import qs from 'qs';
import { isBrowser } from 'lib/isServer';
import { devLog } from 'lib/devLog';
import widerplanetTracker from 'childs/lib/tracking/widerplanet/widerplanetTracker';
import Cookies from 'js-cookie';
import key from 'childs/lib/constant/key';

moment.locale('ko');

class MarketPlatform extends App {
  static async getInitialProps(appContext) {
    const { Component, ctx } = appContext;

    if (isBrowser) {
      devLog(`[_app] getInitialProps: appContext`, appContext);
      MarketPlatform.naverShoppingTracker();
      MarketPlatform.aceCouterTracker(ctx.asPath);
    }

    // Get or Create the store with `undefined` as initialState
    // This allows you to set a custom default initialState
    const mobxStore = initializeStore();

    // Provide the store to getInitialProps of pages
    appContext.ctx.mobxStore = mobxStore;

    let initialProps = {};

    // 컴포넌트에 getInitialProps 메소드가 선언되어 있으면 실행시킨다.
    if (Component.getInitialProps) {
      initialProps = await Component.getInitialProps(ctx);
    }

    return {
      initialMobxState: mobxStore,
      initialProps,
    };
  }

  constructor(props) {
    super(props);
    const isServer = typeof window === 'undefined';

    this.mobxStore = isServer
      ? props.initialMobxState
      : initializeStore(props.initialMobxState);

    if (typeof window !== 'undefined') {
      ReactModal.setAppElement('body');
    }
  }

  componentDidMount() {
    this.initDaumTracker();
    this.execWiderPlanetTracker();
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
   * 상품 상세, 카트, 트래커 페이지는 전환이 발생하는 곳이므로 공통 전환을 실행하지 않는다.
   */
  execWiderPlanetTracker = () => {
    const locationHasConversion = [
      /^\/productdetail.*/, // 상품 상세
      /^\/shoppingcart.*/, // 카트
      /^\/orderpaymentsuccess.*/, // 구매 완료
    ];

    if (isBrowser) {
      const isLocationHasConversion =
        locationHasConversion
          .map(regex => regex.test(window.location.pathname))
          .findIndex(result => result === true) > -1;

      if (isLocationHasConversion) {
        return;
      } else {
        if (Cookies.get(key.ACCESS_TOKEN)) {
          // 회원정보 가져와서 실행
          this.mobxStore.user.pushJobForUserInfo(userInfo => {
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

  static aceCouterTracker = asPath => {
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
    const { Component, initialProps } = this.props;

    return (
      <Container>
        <Provider {...this.mobxStore}>
          <>
            <Component {...initialProps} />

            <AlertConductor />

            <AssociatedProduct />
          </>
        </Provider>
      </Container>
    );
  }
}
export default MarketPlatform;
