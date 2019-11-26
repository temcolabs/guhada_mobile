import React, { Component } from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';

import MypageLayout from 'components/mypage/MypageLayout';

/**
 * 주문 취소 ・ 교환 ・ 반품 상세
 */
@withRouter
class OrderClaimDetail extends Component {
  render() {
    return (
      <DefaultLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        toolBar={false}
        headerShape={'mypage'}
      >
        <MypageLayout>
          <div>주문 배송 (주문 취소 ・ 교환 ・ 반품 목록)</div>
        </MypageLayout>
      </DefaultLayout>
    );
  }
}

export default OrderClaimDetail;
