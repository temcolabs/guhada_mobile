import { useState } from 'react';
import css from './RefundAccount.module.scss';
import { useObserver } from 'mobx-react';
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
            onChange={(e) => {
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
          <div className={[css.refundInfo, css.bankOwner].join(' ')}>
            <input
              type="text"
              name="bankOwner"
              value={
                orderPaymentStore.orderUserInfo?.refundBankAccountOwner || ''
              }
              disabled
            />
          </div>
          <div
            className={css.checkAccount}
            onClick={() => {
              verifyAccount();
            }}
          >
            계좌 확인
          </div>
        </div>

        {!orderPaymentStore.status.refundBankAccount ? (
          <div className={css.errorMessage}>계좌를 확인해주세요</div>
        ) : null}
      </div>
      <div className={css.refundWarning}>
        &middot; 무통장 입금 후 주문취소 또는 반품이 발생할 경우 취소/반품
        완료일로부터 1~2영업일(주말, 공휴일 제외)이내에 입력하신 계좌로 환불처리
        됩니다.
      </div>
    </div>
  ));
};

export default RefundAccount;
