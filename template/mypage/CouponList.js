import React, { Component } from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';
import MypageLayout from 'components/mypage/MypageLayout';
import MypageCouponTab from 'components/mypage/coupon/MypageCouponTab';
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
        <MypageLayout>
          <div>
            <MypageCouponTab />
          </div>
        </MypageLayout>
      </DefaultLayout>
    );
  }
}

export default CouponList;
