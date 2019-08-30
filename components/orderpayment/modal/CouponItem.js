import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './CouponItem.module.scss';

@inject('orderPaymentCoupon')
@observer
class CouponItem extends Component {
  render() {
    let { orderPaymentCoupon } = this.props;
    return (
      <div className={css.wrap}>
        <label>
          {/* <div className={css.radioWrap}>
            <input
              type="radio"
              name="couponradio"
              onChange={() => {
                orderPaymentCoupon.couponSelect();
              }}
            />
          </div>
          <div className={css.couponWrap}>
            <div className={css.couponImage}>
              <div className={css.couponContent}>3,000원</div>
              <div className={css.couponSide} />
            </div>
            <div className={css.couponTag}>
              <div className={css.couponName}>장바구니 3,000원 할인 쿠폰</div>
              <div className={css.couponDate}>2019. 5. 1 - 2019. 5. 31</div>
            </div>
          </div> */}
        </label>
      </div>
    );
  }
}

export default CouponItem;
