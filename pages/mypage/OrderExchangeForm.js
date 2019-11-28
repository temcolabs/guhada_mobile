import React, { Component } from 'react';
import Head from 'next/head';
import OrderExchangeForm from 'template/mypage/OrderExchangeForm';
import withAuth from 'components/common/hoc/withAuth';

class OrderExchangeFormPage extends Component {
  render() {
    return (
      <>
        <Head>
          <title>마이페이지</title>
        </Head>

        <OrderExchangeForm />
      </>
    );
  }
}

export default withAuth({ isAuthRequired: true })(OrderExchangeFormPage);
