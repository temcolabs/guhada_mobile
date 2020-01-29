import React, { useState } from 'react';
import css from './RefundAccount.module.scss';
import _ from 'lodash';
import { useObserver } from 'mobx-react-lite';
import useStores from 'stores/useStores';
import RefundAccountBankSelect from './RefundAccountBankSelect';

const RefundAccount = () => {
  const { orderpayment: orderPaymentStore } = useStores();
  const [isValidatingTried, setIsValidatingTried] = useState(true);
  const verifyAccount = () => {
    setIsValidatingTried(false);
    orderPaymentStore.verifyAccount();
  };

  return useObserver(() => (
    <div className={css.wrap}>
      <div className={css.title}>환불 계좌정보</div>

      <div className={css.refundInfoWrap}>
        <div className={css.refundInfoTitle}>은행명</div>
        <div className={css.refundInfo}>
          <RefundAccountBankSelect />
        </div>
        {!isValidatingTried &&
        !orderPaymentStore.orderUserInfo.refundBankName ? (
          <div className={css.errorMessage}>빈칸을 입력해주세요.</div>
        ) : null}
      </div>

      <div className={css.refundInfoWrap}>
        <div className={css.refundInfoTitle}>계좌번호</div>
        <div className={css.refundInfo}>
          <input
            type="text"
            placeholder="계좌번호를 입력해주세요."
            name="bankAccount"
            value={
              orderPaymentStore.orderUserInfo?.refundBankAccountNumber || ''
            }
            onChange={e => {
              orderPaymentStore.setAccountInfo(e);
            }}
          />
        </div>
        {!isValidatingTried &&
        !orderPaymentStore.orderUserInfo.refundBankAccountNumber ? (
          <div className={css.errorMessage}>빈칸을 입력해주세요.</div>
        ) : null}
      </div>

      <div className={css.refundInfoWrap}>
        <div className={css.refundInfoTitle}>예금주명 (본인명)</div>
        <div className={css.refundInfoContent}>
          <div className={css.refundInfo}>
            <input
              type="text"
              placeholder="입력해주세요."
              name="bankHolder"
              value={
                orderPaymentStore.orderUserInfo?.refundBankAccountOwner || ''
              }
              onChange={e => {
                orderPaymentStore.setAccountInfo(e);
              }}
            />
          </div>
          <div
            className={css.checkAccount}
            onClick={() => {
              verifyAccount();
            }}
          >
            계좌확인
          </div>
        </div>

        {!isValidatingTried &&
        !orderPaymentStore.orderUserInfo.refundBankAccountOwner ? (
          <div className={css.errorMessage}>빈칸을 입력해주세요.</div>
        ) : null}
      </div>
    </div>
  ));
};

export default RefundAccount;
