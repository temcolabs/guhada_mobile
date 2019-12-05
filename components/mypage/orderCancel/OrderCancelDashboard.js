import React from 'react';
import css from './OrderCancelDashboard.module.scss';

function OrderCancelDashboard({
  data = {
    cancelOrder: 0,
    exchangeOrder: 0,
    returnOrder: 0,
  },
}) {
  return (
    <div className={css.wrap}>
      <div className={css.stateWrapper}>
        <div className={css.orderState} data-order="1">
          <div className={css.desc}>취소</div>
          <div className={css.value}>
            {Number.isInteger(data.cancelOrder) ? data.cancelOrder : '-'}
          </div>
        </div>
        <div className={css.divider} />
        <div className={css.orderState} data-order="2">
          <div className={css.desc}>교환</div>
          <div className={css.value}>
            {Number.isInteger(data.exchangeOrder) ? data.exchangeOrder : '-'}
          </div>
        </div>
        <div className={css.divider} />
        <div className={css.orderState} data-order="3">
          <div className={css.desc}>반품</div>
          <div className={css.value}>
            {Number.isInteger(data.returnOrder) ? data.returnOrder : '-'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderCancelDashboard;
