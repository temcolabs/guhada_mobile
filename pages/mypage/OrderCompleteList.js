import React, { Component } from 'react';
import Head from 'next/head';
import OrderCompleteList from 'template/mypage/OrderCompleteList';
import withAuth from 'components/common/hoc/withAuth';

/**
 * 마이페이지 - 주문배송
 * 현재 진행 중인 배송 정보 목록
 */
@withAuth({ isAuthRequired: true })
class OrderCompleteListPage extends Component {
  render() {
    return (
      <>
        <Head>
          <title>나의 주문 - 주문배송</title>
        </Head>
        <OrderCompleteList />
      </>
    );
  }
}

export default OrderCompleteListPage;
