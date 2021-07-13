import { Component } from 'react';
import Head from 'next/head';
import OrderCancelDone from 'template/mypage/OrderCancelDone';
import withAuth from 'components/common/hoc/withAuth';

class OrderCancelDonePage extends Component {
  render() {
    return (
      <>
        <Head>
          <title>마이페이지</title>
        </Head>

        <OrderCancelDone />
      </>
    );
  }
}

export default withAuth({ isAuthRequired: true })(OrderCancelDonePage);
