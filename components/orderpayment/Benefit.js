import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './Benefit.module.scss';
import CouponSelect from './CouponSelect';
@inject('orderPaymentPoint')
@observer
class Benefit extends Component {
  componentDidMount() {
    this.props.orderPaymentPoint.getAvailablePoint();
    this.props.orderPaymentPoint.getMyPoint();
    this.props.orderPaymentPoint.getDueSavePoint();
  }
  render() {
    let { orderPaymentPoint } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.title}>할인적용</div>

        <div className={css.coupon}>
          <div className={css.couponTitle}>쿠폰</div>
          <div className={css.couponSelectBox}>
            <div className={css.couponSelect}>
              <CouponSelect />
            </div>
            <div className={css.couponAutoSelect}>자동 적용</div>
          </div>
        </div>

        <div className={css.point}>
          <div className={css.pointTitle}>포인트</div>
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
              <div className={css.myPoint}>
                사용가능
                <span>{` ${orderPaymentPoint.availablePoint.toLocaleString()}P `}</span>
              </div>
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
