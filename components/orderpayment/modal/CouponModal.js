import React, { Component, Fragment } from 'react';
import css from './CouponModal.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import { inject, observer } from 'mobx-react';
import CouponList from './CouponList';
@inject('orderPaymentCoupon')
@observer
class CouponModal extends Component {
  render() {
    const { orderPaymentCoupon, isVisible } = this.props;
    return (
      <Fragment>
        <SlideIn direction={slideDirection.BOTTOM} isVisible={isVisible}>
          <div className={css.wrap}>
            <div className={css.header}>
              <div>
                <div className={css.title}>쿠폰 적용</div>
                <div
                  className={css.close}
                  onClick={() => {
                    orderPaymentCoupon.modalHide();
                  }}
                />
              </div>
            </div>
            <div className={css.couponList}>
              <CouponList seller={true} />

              <CouponList seller={true} />
            </div>

            <div className={css.couponResultWrap}>
              <div className={css.totalSummary}>
                <div className={css.couponTotal}>총 3개 상품</div>
                <div className={css.totalOrderPrice}>
                  <div>총 주문상품금액</div>
                  <div>1,307,000원</div>
                </div>

                <div className={css.totalDiscountPrice}>
                  <div>총 할인금액</div>
                  <div>- 166,200원</div>
                </div>
              </div>
              <div className={css.resultPrice}>
                <div>총 상품금액</div>
                <div>
                  1,140,800<span>원</span>
                </div>
              </div>
            </div>

            <div className={css.confirmButton}>적용하기</div>
          </div>
        </SlideIn>
      </Fragment>
    );
  }
}

export default CouponModal;
