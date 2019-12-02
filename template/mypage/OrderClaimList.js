import React, { Component } from 'react';
import { withRouter } from 'next/router';
import MypageLayout from 'components/mypage/MypageLayout';

/**
 * 마이페이지 - 주문 배송 (주문 취소 ・ 교환 ・ 반품 목록)
 */
@withRouter
class OrderClaimList extends Component {
  render() {
    return (
      <MypageLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        headerShape={'mypage'}
      >
        <div>주문 배송 (주문 취소 ・ 교환 ・ 반품 목록)</div>
      </MypageLayout>
    );
  }
}

export default OrderClaimList;
