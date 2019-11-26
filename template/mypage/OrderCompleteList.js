import React, { Component } from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';

import MyPageLayout from 'components/mypage/MyPageLayout';
/**
 * 마이페이지 - 주문 배송 (주문 완료 목록)
 */
@withRouter
class OrderCompleteList extends Component {
  render() {
    return (
      <DefaultLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        toolBar={false}
        headerShape={'mypage'}
      >
        <MyPageLayout>
          <div>주문배송</div>
        </MyPageLayout>
      </DefaultLayout>
    );
  }
}

export default OrderCompleteList;
