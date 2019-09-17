import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import css from './CouponList.module.scss';

@inject('orderPaymentCoupon')
@observer
class CouponList extends Component {
  render() {
    let { orderPaymentCoupon } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.title}>더 팩토리 압구정점</div>
        <div className={css.conponItem}>
          <Product />
          <CouponItem />
        </div>
      </div>
    );
  }
}

export default CouponList;

const Product = () => {
  return (
    <div className={css.couponWrap}>
      <div className={css.productInfo}>
        <div
          className={css.productImage}
          style={{
            backgroundImage: `url('https://d3ikprf0m31yc7.cloudfront.net/images/deals/3459bdb844de4390a9df838b2c855cd6')`,
          }}
        />
        <div className={css.productDetail}>
          <div className={css.brandName}>ACNE</div>
          <div className={css.productName}>19FW 슬림핏 하프넥 플라워 패턴</div>
          <div className={css.productPrice}>215,000원</div>
          <div className={css.productOption}>체리 85 1개</div>
        </div>
      </div>
    </div>
  );
};

const CouponItem = () => {
  return (
    <div className={css.couponWrap}>
      <div className={css.couponList}>
        <div className={css.couponItem}>
          <label>
            <div className={css.radioWrap}>
              <input type="radio" name="coupon" />
            </div>
            <div className={css.couponName}>
              10% 할인 [오픈기념 쿠폰](21,500원 할인)
            </div>
          </label>
          <label>
            <div className={css.radioWrap}>
              <input type="radio" name="coupon2" />
            </div>
            <div className={css.couponName}>
              10% 할인 [오픈기념 쿠폰](21,500원 할인)
            </div>
          </label>
          <label>
            <div className={css.radioWrap}>
              <input type="radio" name="coupon3" />
            </div>
            <div className={css.couponName}>적용 안함</div>
          </label>
        </div>
      </div>
    </div>
  );
};
