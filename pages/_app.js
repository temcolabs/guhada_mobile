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
import routes from '../routes';
import pathMatch from 'path-match';
import qs from 'qs';
import { isBrowser } from 'lib/isServer';

const match = pathMatch();

moment.locale('ko');

class MarketPlatform extends App {
  static async getInitialProps(appContext) {
    if (process.env.NODE_ENV === 'development' && isBrowser) {
      console.group(`app page rendered`);
      console.log(`appContext`, appContext);
      console.groupEnd(`app page rendered`);
    }

    // Get or Create the store with `undefined` as initialState
    // This allows you to set a custom default initialState
    const mobxStore = initializeStore();

    // Provide the store to getInitialProps of pages
    appContext.ctx.mobxStore = mobxStore;

    const { Component, ctx } = appContext;

    let initialProps = {};

    // 컴포넌트에 getInitialProps 메소드가 선언되어 있으면 실행시킨다.
    if (Component.getInitialProps) {
      initialProps = await Component.getInitialProps(ctx);
    }

    // 커스텀 라우트에 설정한 파라미터를 가져온다.
    let query = {};
    const route = routes.find(r => r.pagePath === ctx.pathname);
    if (route) {
      const [path, querystring] = ctx.asPath.split('?');
      const paramsMatched = match(route.asPath)(path);

      if (!!paramsMatched) {
        query = Object.assign({}, paramsMatched, qs.parse(querystring));
      }
    }

    return {
      initialMobxState: mobxStore,
      initialProps,
      query,
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
    // this.loadPaymentScript();
  }

  /**
   * 결제 모듈 로드. 리소스가 사용 가능한지 확인하고 불러온다.
   */
  // loadPaymentScript = () => {
  //   const url = 'https://devstdpay.lpay.com:420/stdjs/INIStdPay_dev.js';

  //   Axios.request({
  //     method: 'GET',
  //     url: 'https://devstdpay.lpay.com:420/stdjs/INIStdPay_dev.js',
  //     timeout: 1000,
  //   })
  //     .then(res => {
  //       loadScript(url);
  //     })
  //     .catch(e => {
  //       console.error('[INIStdPay_dev.js 불러오기 실패]', e);
  //     });
  // };

  render() {
    const { Component, initialProps, router, query } = this.props;

    // 클라이언트 사이드 라우팅을 위해 파싱된 쿼리가 있으면 next router의 쿼리 객체에 추가해준다.
    if (router && !!query) {
      router.query = Object.assign({}, router.query, query);
    }

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
