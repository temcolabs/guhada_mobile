import { Component } from 'react';
import Head from 'next/head';
import OrderCancelForm from 'template/mypage/OrderCancelForm';
import withAuth from 'components/common/hoc/withAuth';

class OrderCancelFormPage extends Component {
  render() {
    return (
      <>
        <Head>
          <title>마이페이지</title>
        </Head>

        <OrderCancelForm />
      </>
    );
  }
}

export default withAuth({ isAuthRequired: true })(OrderCancelFormPage);
