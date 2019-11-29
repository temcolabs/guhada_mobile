import React, { Fragment, Component } from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';
import MypageLayout from 'components/mypage/MypageLayout';
import MypageCouponTab from 'components/mypage/coupon/MypageCouponTab';
import MypageCouponEnrollment from 'components/mypage/coupon/MypageCouponEnrollment';
import MypageValidCouponList from 'components/mypage/coupon/MypageValidCouponList';
import MypageInvalidCouponList from 'components/mypage/coupon/MypageInvalidCouponList';

import { inject, observer } from 'mobx-react';
/**
 * 마이페이지 - 쿠폰
 */
@withRouter
@inject('mypageCoupon')
@observer
class CouponList extends React.Component {
  render() {
    let { mypageCoupon } = this.props;
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

            {/* 쿠폰 리스트 */}
            {mypageCoupon.activeTab ? (
              <Fragment>
                <MypageCouponEnrollment />

                <MypageValidCouponList />
              </Fragment>
            ) : (
              <MypageInvalidCouponList />
            )}
          </div>
        </MypageLayout>
      </DefaultLayout>
    );
  }
}

export default CouponList;
