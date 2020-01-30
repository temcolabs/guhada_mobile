import React, { Component } from 'react';
import css from './Coupon.module.scss';
import { inject, observer } from 'mobx-react';
import CouponDownModal from './CouponDownModal';
@inject('productdetail', 'productoption')
@observer
class Coupon extends Component {
  render() {
    let { productoption } = this.props;
    return (
      <div className={css.wrap}>
        {/* 상품 쿠폰 */}
        {productoption.dueSavebenefitCoupon.length > 0 &&
          productoption.dueSavebenefitCoupon
            .slice(0, 1)
            .map((coupon = {}, index) => {
              // TODO: 쿠폰 다운로드 여부 확인
              const isCouponDownloaded = coupon.alreadySaved;

              return isCouponDownloaded ? (
                <div className={css.coupon__wrap} key={index}>
                  <div
                    className={css.coupon__title}
                    style={{ backgroundColor: '#ccc' }}
                  >
                    {`${
                      coupon.saveTargetType === 'FOLLOW'
                        ? coupon.couponTitle
                        : coupon.discountType === 'RATE'
                        ? (coupon.discountRate * 100).toFixed(0) + `% 할인쿠폰`
                        : coupon.discountPrice?.toLocaleString() + `원 할인쿠폰`
                    }`}
                  </div>
                  <div
                    className={css.coupon__down}
                    style={{
                      backgroundImage: `url('/static/icon/m_coupon_download_off.png')`,
                    }}
                  />
                </div>
              ) : (
                <div
                  className={css.coupon__wrap}
                  onClick={() => {
                    productoption.couponDownModalOpen();
                  }}
                  key={index}
                >
                  <div
                    className={css.coupon__title}
                    style={{ backgroundColor: '#5d2ed1' }}
                  >
                    {`${
                      coupon.saveTargetType === 'FOLLOW'
                        ? coupon.couponTitle
                        : coupon.discountType === 'RATE'
                        ? (coupon.discountRate * 100).toFixed(0) + `% 할인쿠폰`
                        : coupon.discountPrice?.toLocaleString() + `원 할인쿠폰`
                    }`}
                  </div>
                  <div
                    className={css.coupon__down}
                    style={{
                      backgroundImage: `url('/static/icon/m_coupon_download_on.png')`,
                    }}
                  />
                </div>
              );
            })}

        <CouponDownModal isVisible={productoption.couponIsOpen} />
      </div>
    );
  }
}

export default Coupon;
