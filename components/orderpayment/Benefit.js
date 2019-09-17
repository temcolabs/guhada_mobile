import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './Benefit.module.scss';
import CouponModal from './modal/CouponModal';
@inject('orderPaymentPoint', 'orderPaymentCoupon')
@observer
class Benefit extends Component {
  componentDidMount() {
    this.props.orderPaymentPoint.getAvailablePoint();
    this.props.orderPaymentPoint.getMyPoint();
    this.props.orderPaymentPoint.getDueSavePoint();

    this.props.orderPaymentCoupon.modalShow();
  }

  render() {
    let { orderPaymentPoint, orderPaymentCoupon } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.title}>할인적용</div>

        <div className={css.coupon}>
          <div className={css.couponTitle}>쿠폰</div>
          <div className={css.couponSelectBox}>
            <div
              className={css.couponSelect}
              onClick={() => {
                orderPaymentCoupon.modalShow();
              }}
            >
              <div>적용가능한 쿠폰을 선택해주세요.</div>
              <div />
            </div>
            {/* <div className={css.couponAutoSelect}>자동 적용</div> */}
          </div>
        </div>

        <CouponModal isVisible={orderPaymentCoupon.status.couponModal} />

        <div className={css.point}>
          <div className={css.pointTitle}>
            <div>포인트</div>
            <div>
              (사용가능{' '}
              <span>{orderPaymentPoint.availablePoint.toLocaleString()}</span>
              P)
            </div>
          </div>
          <div className={css.pointSelectBox}>
            <div className={css.pointSelect}>
              <input
                type="text"
                value={orderPaymentPoint.usePoint.toLocaleString()}
                onChange={e => {
                  orderPaymentPoint.setUsePoint(e);
                }}
                maxLength="11"
              />
            </div>
            <div
              className={css.pointAutoSelect}
              onClick={() => {
                orderPaymentPoint.pointfullUse();
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
