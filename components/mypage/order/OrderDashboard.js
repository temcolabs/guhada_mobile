import React from 'react';
import css from './OrderDashboard.module.scss';

/**
 * 주문배송 상단의 상태 요약 UI
 * @param {*} param0
 */
function OrderDashboard({
  data = {
    deliveryComplete: 0,
    paymentComplete: 0,
    prepareProduct: 0,
    sending: 0,
    waitingPayment: 0,
  },
}) {
  return (
    <div className={css.wrap}>
      <div className={css.stateWrapper}>
        <div className={css.orderState} data-order="1">
          <div className={css.value}>
            {Number.isInteger(data.waitingPayment) ? data.waitingPayment : '-'}
          </div>
          <div className={css.desc}>입금 확인중</div>
        </div>
        <div className={css.divider} />
        <div className={css.orderState} data-order="2">
          <div className={css.value}>
            {Number.isInteger(data.paymentComplete)
              ? data.paymentComplete
              : '-'}
          </div>
          <div className={css.desc}>결제완료</div>
        </div>
        <div className={css.divider} />
        <div className={css.orderState} data-order="3">
          <div className={css.value}>
            {Number.isInteger(data.prepareProduct) ? data.prepareProduct : '-'}
          </div>
          <div className={css.desc}>상품 준비중</div>
        </div>
        <div className={css.divider} />
        <div className={css.orderState} data-order="4">
          <div className={css.value}>
            {Number.isInteger(data.sending) ? data.sending : '-'}
          </div>
          <div className={css.desc}>배송중</div>
        </div>
        <div className={css.divider} />
        <div className={css.orderState} data-order="5">
          <div className={css.value}>
            {Number.isInteger(data.deliveryComplete)
              ? data.deliveryComplete
              : '-'}
          </div>
          <div className={css.desc}>배송완료</div>
        </div>
      </div>
    </div>
  );
}

export default OrderDashboard;
