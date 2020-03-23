import React from 'react';
import css from './PaymentLoading.module.scss';
import { useObserver } from 'mobx-react-lite';
function PaymentLoading({ isVisible }) {
  return useObserver(() =>
    isVisible ? (
      <div className={css.wrap}>
        <div>결제가 진행중입니다.</div>
      </div>
    ) : null
  );
}

export default PaymentLoading;
