import React, { Component } from 'react';
import Head from 'next/head';
import OrderReturnDone from 'template/mypage/OrderReturnDone';
import withAuth from 'components/common/hoc/withAuth';

class OrderReturnDonePage extends Component {
  render() {
    return (
      <>
        <Head>
          <title>마이페이지</title>
        </Head>

        <OrderReturnDone />
      </>
    );
  }
}

export default withAuth({ isAuthRequired: true })(OrderReturnDonePage);
