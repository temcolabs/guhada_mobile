import React, { Component } from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';

import MyPageLayout from 'components/mypage/MyPageLayout';

@withRouter
class OrderCompleteDetail extends Component {
  render() {
    return (
      <DefaultLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        toolBar={false}
        headerShape={'mypage'}
      >
        <MyPageLayout>
          <div>주문내역 상세</div>
        </MyPageLayout>
      </DefaultLayout>
    );
  }
}

export default OrderCompleteDetail;
