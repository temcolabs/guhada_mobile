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

moment.locale('ko');

class MarketPlatform extends App {
  static async getInitialProps(appContext) {
    if (process.env.NODE_ENV === 'development' && isBrowser) {
      devLog(`[_app] getInitialProps: appContext`, appContext);
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
            <Component key={this.componentKey} {...initialProps} />

            <AlertConductor />

            <AssociatedProduct />
          </>
        </Provider>
      </Container>
    );
  }
}
export default MarketPlatform;
