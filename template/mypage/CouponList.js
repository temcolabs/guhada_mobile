import React, { Fragment } from 'react';
import { withRouter } from 'next/router';
import MypageLayout from 'components/mypage/MypageLayout';
import MypageCouponTab from 'components/mypage/coupon/MypageCouponTab';
import MypageCouponEnrollment from 'components/mypage/coupon/MypageCouponEnrollment';
import MypageValidCouponList from 'components/mypage/coupon/MypageValidCouponList';
import MypageInvalidCouponList from 'components/mypage/coupon/MypageInvalidCouponList';
import { isBrowser } from 'lib/common/isServer';
import { inject, observer } from 'mobx-react';
/**
 * 마이페이지 - 쿠폰
 */
@withRouter
@inject('mypageCoupon')
@observer
class CouponList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (isBrowser) {
      this.getVaildCoupon();
      this.getInvaildCoupon();
    }
  }

  getVaildCoupon = () => {
    const { mypageCoupon } = this.props;
    mypageCoupon.getVaildCoupon({ page: 1 });
  };

  getInvaildCoupon = () => {
    const { mypageCoupon } = this.props;
    mypageCoupon.getInvaildCoupon({ page: 1 });
  };
  render() {
    let { mypageCoupon } = this.props;
    return (
      <MypageLayout
        topLayout={'main'}
        pageTitle={'쿠폰'}
        headerShape={'mypageDetail'}
      >
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
    );
  }
}

export default CouponList;
