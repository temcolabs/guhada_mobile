import { Component } from 'react';
import Head from 'next/head';
import withAuth from 'components/common/hoc/withAuth';
import OrderClaimDetail from 'template/mypage/OrderClaimDetail';

/**
 * 내 주문 클레임 상세정보
 */
@withAuth({ isAuthRequired: true })
class OrderClaimDetailPage extends Component {
  static async getInitialProps({ req }) {
    return {};
  }

  render() {
    return (
      <>
        <Head>
          <title>나의 주문 - 주문배송</title>
        </Head>

        <OrderClaimDetail />
      </>
    );
  }
}

export default OrderClaimDetailPage;
