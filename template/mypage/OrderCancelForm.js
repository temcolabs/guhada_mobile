import React, { Component } from 'react';
import { withRouter } from 'next/router';
import MypageLayout from 'components/mypage/MypageLayout';
/**
 * 주문 취소 신청 페이지
 */

@withRouter
class OrderCancelForm extends Component {
  render() {
    return (
      <MypageLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        headerShape={'mypage'}
      >
        <div>주문 취소 신청 페이지</div>
      </MypageLayout>
    );
  }
}

export default OrderCancelForm;
