import { Component } from 'react';
import Head from 'next/head';
import OrderReturnForm from 'template/mypage/OrderReturnForm';
import withAuth from 'components/common/hoc/withAuth';

class OrderReturnFormPage extends Component {
  render() {
    return (
      <>
        <Head>
          <title>마이페이지</title>
        </Head>

        <OrderReturnForm />
      </>
    );
  }
}

export default withAuth({ isAuthRequired: true })(OrderReturnFormPage);
