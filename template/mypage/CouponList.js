import React, { Component } from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';

import MyPageLayout from 'components/mypage/MyPageLayout';

/**
 * 마이페이지 - 쿠폰
 */
@withRouter
class CouponList extends React.Component {
  render() {
    return (
      <DefaultLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        toolBar={false}
        headerShape={'mypage'}
      >
        <MyPageLayout>
          <div>쿠폰 리스트</div>
        </MyPageLayout>
      </DefaultLayout>
    );
  }
}

export default CouponList;
