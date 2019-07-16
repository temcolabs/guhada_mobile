import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './ShippingInfo.module.scss';
@inject('orderpaymentsuccess', 'user')
@observer
class OrderInfo extends Component {
  render() {
    let { orderpaymentsuccess } = this.props;
    let { orderSuccessShipping, orderSuccessPayment } = orderpaymentsuccess;
    return (
      <div className={css.wrap}>
        <div className={css.orderInfoSection}>
          <div>주문번호</div>
          <div>{orderpaymentsuccess.orderSuccessNumber}</div>
          {/* <div>주문내역보기 ></div> */}
        </div>
        <div className={css.orderInfoSection}>
          <div>받는분</div>
          <div>{orderSuccessShipping.receiverName}</div>
        </div>
        <div className={css.orderInfoSection}>
          <div>연락처</div>
          <div>{orderSuccessShipping.phone}</div>
        </div>
        <div className={css.orderInfoSection}>
          <div>주소</div>
          <div>
            {orderSuccessShipping.roadAddress
              ? `[${orderSuccessShipping.zipcode}] ${
                  orderSuccessShipping.roadAddress
                } ${orderSuccessShipping.addressDetail}`
              : `[${orderSuccessShipping.zipcode}] ${
                  orderSuccessShipping.addressBasic
                } ${orderSuccessShipping.addressDetail}`}
          </div>
        </div>
        <div className={css.orderInfoSection}>
          <div>배송메모</div>
          <div>{orderSuccessShipping.message}</div>
        </div>
        <div className={css.orderInfoSection}>
          <div>결제방법</div>
          <div>
            {orderSuccessPayment.parentMethod === 'Card' ? (
              <div className={css.paymentMethod}>신용/체크카드</div>
            ) : orderSuccessPayment.parentMethod === 'Vbank' ? (
              <div className={css.paymentMethod}>가상계좌</div>
            ) : orderSuccessPayment.parentMethod === 'DirectBank' ? (
              <div className={css.paymentMethod}>무통장입금</div>
            ) : orderSuccessPayment.parentMethod === 'TOKEN' ? (
              <div className={css.paymentMethod}>토큰결제</div>
            ) : null}
            <div className={css.paymentInfo}>{orderSuccessPayment.method}</div>
            <div className={css.paymentDate}>
              {orderpaymentsuccess.completeAt}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderInfo;
