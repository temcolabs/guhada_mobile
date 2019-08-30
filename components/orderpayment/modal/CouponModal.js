import React, { Component, Fragment } from 'react';
import css from './CouponModal.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import { inject, observer } from 'mobx-react';
import CouponItem from './CouponItem';
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
              <div className={css.title}>쿠폰 변경</div>
              <div
                className={css.close}
                onClick={() => {
                  orderPaymentCoupon.modalHide();
                }}
              />
            </div>

            <CouponItem />
          </div>
        </SlideIn>
      </Fragment>
    );
  }
}

export default CouponModal;
