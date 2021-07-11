import React from 'react';
import css from './PaymentLoading.module.scss';
import { LoadingSpinner } from '/components/common/loading/Loading';
import { useObserver } from 'mobx-react';
function PaymentLoading({ isVisible }) {
  return useObserver(() =>
    isVisible ? (
      <div className={css.wrap}>
        <LoadingSpinner />
        <div className={css.notice}>
          <div>결제가 진행중입니다.</div>
          <div>잠시만 기다려주세요.</div>
        </div>
      </div>
    ) : null
  );
}

export default PaymentLoading;
