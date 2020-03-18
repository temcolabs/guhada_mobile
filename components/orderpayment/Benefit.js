import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './Benefit.module.scss';
import CouponSelectModal from './modal/CouponSelectModal';
import { devLog } from 'childs/lib/common/devLog';
@inject('orderpayment', 'orderPaymentBenefit', 'alert')
@observer
class Benefit extends Component {
  state = {
    sellerList: [],
    couponProductList: [],
  };
  pointHandler = e => {
    let checkValue = e.target.value.replace(/[0-9]|,/g, '');
    checkValue = Number(checkValue);
    if (isNaN(checkValue)) {
      return false;
    }

    let { orderpayment, alert } = this.props;
    let value = e.target.value.replace(/[^0-9]/g, '');
    value = Number(value);
    devLog(value, 'value');

    if (
      value > orderpayment.orderInfo.availablePointResponse.availableTotalPoint
    ) {
      alert.showAlert({
        content: '최대 사용 가능 포인트 초과 입니다.',
      });

      orderpayment.usePoint =
        orderpayment.orderInfo.availablePointResponse.availableTotalPoint;
      orderpayment.getPaymentInfo();
    } else {
      orderpayment.usePoint = value;

      orderpayment.getPaymentInfo();
    }
  };

  pointfullUse = () => {
    let { orderpayment } = this.props;
    let myPoint = orderpayment.orderInfo.totalPoint;
    let availablePoint =
      orderpayment.orderInfo.availablePointResponse.availableTotalPoint;

    if (myPoint > 0) {
      if (myPoint >= availablePoint) {
        orderpayment.usePoint = availablePoint;
        orderpayment.getPaymentInfo();
      } else {
        orderpayment.usePoint = myPoint;

        orderpayment.getPaymentInfo();
      }
    }
  };

  render() {
    let { orderpayment, orderPaymentBenefit } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.title}>할인적용</div>

        <div className={css.coupon}>
          <div className={css.couponTitle}>
            쿠폰
            <span> (사용가능 </span>
            <span className={css.myCoupon}>
              {orderpayment.orderCouponInfo?.availableCouponCount
                ? ` ${orderpayment.orderCouponInfo?.availableCouponCount || ''}`
                : ` 0`}
            </span>
            <span>{`장 / 보유 ${
              orderpayment.orderCouponInfo?.savedCouponCount
                ? orderpayment.orderCouponInfo?.savedCouponCount || ''
                : 0
            }장)`}</span>
          </div>
          <div className={css.couponSelectBox}>
            <div className={css.couponInput}>
              {orderPaymentBenefit.applyCoupon.applyCouponAmount ? (
                <div
                  className={css.applyCoupon}
                >{`${orderPaymentBenefit.applyCoupon.applyDiscount?.toLocaleString() ||
                  '0'}원 (${orderPaymentBenefit.applyCoupon.applyCouponAmount ||
                  '0'}장)`}</div>
              ) : (
                <div>
                  {`${orderpayment.orderCouponInfo?.totalCouponDiscountPrice?.toLocaleString() ||
                    '0'}원 (${orderpayment.orderCouponInfo
                    ?.selectedCouponCount || '0'}장)`}
                </div>
              )}
            </div>
            {orderpayment.orderCouponInfo?.savedCouponCount ? (
              <div
                className={css.couponSelect}
                onClick={() => {
                  orderpayment.couponModalShow();
                }}
              >
                쿠폰 변경
              </div>
            ) : (
              <div className={css.nocouponSelect}>쿠폰 변경</div>
            )}
          </div>
        </div>

        <CouponSelectModal isVisible={orderpayment.status.couponSelectModal} />

        <div className={css.point}>
          <div className={css.pointTitle}>
            <div>포인트</div>
            <div>
              (사용가능
              <span>
                {orderpayment?.orderInfo?.availablePointResponse?.availableTotalPoint?.toLocaleString()}
              </span>
            </div>
            <div>{`P / 보유 ${orderpayment?.orderInfo?.totalPoint?.toLocaleString()}P)`}</div>
          </div>
          <div className={css.pointSelectBox}>
            <div className={css.pointSelect}>
              <input
                type="text"
                value={orderpayment.usePoint?.toLocaleString()}
                onChange={e => {
                  this.pointHandler(e);
                }}
              />
            </div>
            <div
              className={css.pointAutoSelect}
              onClick={() => {
                this.pointfullUse();
              }}
            >
              전액 사용
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Benefit;
