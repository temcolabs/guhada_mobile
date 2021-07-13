import { Component } from 'react';
import Head from 'next/head';
import OrderCompleteDetail from 'template/mypage/OrderCompleteDetail';
import withAuth from 'components/common/hoc/withAuth';

/**
 * 내 주문 상세정보
 */
class OrderCompleteDetailPage extends Component {
  static async getInitialProps({ req }) {
    return {};
  }

  /**
   * 취소 교환 반품 상세인지
   */
  get isClaimRoute() {
    return /claimdetail/g.test(this.props.router.asPath);
  }

  render() {
    return (
      <>
        <Head>
          <title>나의 주문 - 주문배송</title>
        </Head>

        <OrderCompleteDetail />
      </>
    );
  }
}

export default withAuth({ isAuthRequired: true })(OrderCompleteDetailPage);
