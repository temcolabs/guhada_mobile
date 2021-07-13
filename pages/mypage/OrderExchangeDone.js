import { Component } from 'react';
import Head from 'next/head';
import OrderExchangeDone from 'template/mypage/OrderExchangeDone';
import withAuth from 'components/common/hoc/withAuth';

class OrderExchangeDonePage extends Component {
  render() {
    return (
      <>
        <Head>
          <title>마이페이지</title>
        </Head>

        <OrderExchangeDone />
      </>
    );
  }
}

export default withAuth({ isAuthRequired: true })(OrderExchangeDonePage);
