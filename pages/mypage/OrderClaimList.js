import { Component } from 'react';
import Head from 'next/head';
import OrderClaimList from 'template/mypage/OrderClaimList';
import withAuth from 'components/common/hoc/withAuth';

/**
 * 마이페이지 - 취소 ・ 교환 ・ 반품
 */
@withAuth({ isAuthRequired: true })
class OrderClaimListPage extends Component {
  render() {
    return (
      <>
        <Head>
          <title>마이페이지 - 취소 ・ 교환 ・ 반품</title>
        </Head>
        <OrderClaimList />
      </>
    );
  }
}

export default OrderClaimListPage;
