import App, { Container } from 'next/app';
import React from 'react';
import { initializeStore } from '../store';
import { Provider } from 'mobx-react';
import '../style.scss';
import ReactModal from 'react-modal';
import moment from 'moment';
import AlertConductor from 'components/common/modal/AlertConductor';
import 'react-dates/initialize';
import routes from '../routes';
import pathMatch from 'path-match';
import Axios from 'axios';
import { loadScript } from 'lib/dom';

const match = pathMatch();

moment.locale('ko');

class MarketPlatform extends App {
  static async getInitialProps(appContext) {
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

    // routes.js 에 선언되어 있는 패턴 기반의 파라미터를 파싱해서 가져온다.
    let params = {};
    const route = routes.find(r => r.pagePath === ctx.pathname);
    if (route) {
      const paramsMatched = match(route.asPath)(ctx.asPath);

      if (!!paramsMatched) {
        params = Object.assign({}, paramsMatched);
      }
    }

    return {
      initialMobxState: mobxStore,
      initialProps,
      params,
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
    this.loadPaymentScript();
  }

  /**
   * 결제 모듈 로드. 리소스가 사용 가능한지 확인하고 불러온다.
   */
  loadPaymentScript = () => {
    const url = 'https://devstdpay.lpay.com:420/stdjs/INIStdPay_dev.js';

    Axios.request({
      method: 'GET',
      url: 'https://devstdpay.lpay.com:420/stdjs/INIStdPay_dev.js',
      timeout: 1000,
    })
      .then(res => {
        loadScript(url);
      })
      .catch(e => {
        console.error('[INIStdPay_dev.js 불러오기 실패]', e);
      });
  };

  render() {
    const { Component, initialProps, router, params } = this.props;

    // 파싱된 파라미터가 있으면 next router의 쿼리 객체에 추가해준다.
    if (router && !!params) {
      router.query = Object.assign({}, router.query, params);
    }

    return (
      <Container>
        <Provider {...this.mobxStore}>
          <>
            <Component {...initialProps} />

            <AlertConductor />
          </>
        </Provider>
      </Container>
    );
  }
}
export default MarketPlatform;
