import React, { Component } from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';

import MypageLayout from 'components/mypage/MypageLayout';
/**
 * 주문 취소 신청 페이지
 */

@withRouter
class OrderCancelForm extends Component {
  render() {
    return (
      <DefaultLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        toolBar={false}
        headerShape={'mypage'}
      >
        <MypageLayout>
          <div>주문 취소 신청 페이지</div>
        </MypageLayout>
      </DefaultLayout>
    );
  }
}

export default OrderCancelForm;
