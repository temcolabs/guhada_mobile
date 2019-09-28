import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './OrderInfo.module.scss';
import addHyphenToMobile from 'lib/string/addHyphenToMobile';
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
          <div>{addHyphenToMobile(orderSuccessShipping.phone)}</div>
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

          {orderSuccessPayment.parentMethod === 'Card' ? (
            <div>
              <div className={css.paymentMethod}>신용/체크카드</div>
              <div className={css.paymentInfo}>
                {orderSuccessPayment.method}
                {orderSuccessPayment.cardQuota === '00' ? ` 일시불` : ` `}
              </div>
              <div className={css.paymentDate}>
                {orderpaymentsuccess.orderAt}
              </div>
            </div>
          ) : orderSuccessPayment.parentMethod === 'VBank' ? (
            <div>
              <div className={css.paymentMethod}>무통장입금</div>
              <div className={css.paymentInfo}>
                {`${orderSuccessPayment.vbankBankName} ${
                  orderSuccessPayment.vbankNo
                }`}
              </div>
              <div className={css.paymentDate}>
                {`${orderpaymentsuccess.vbankExpireAt} 까지`}
              </div>
            </div>
          ) : orderSuccessPayment.parentMethod === 'DirectBank' ? (
            <div>
              <div className={css.paymentMethod}>실시간 계좌이체</div>
              <div className={css.paymentInfo}>
                {orderSuccessPayment.method}
              </div>
              <div className={css.paymentDate}>
                {orderpaymentsuccess.orderAt}
              </div>
            </div>
          ) : orderSuccessPayment.parentMethod === 'TOKEN' ? (
            <div className={css.paymentMethod}>토큰결제</div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default OrderInfo;
