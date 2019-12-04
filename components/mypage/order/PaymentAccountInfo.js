import React from 'react';
import css from './PaymentAccountInfo.module.scss';
import moment from 'moment';
import { dateFormat } from 'childs/lib/constant';
import paymentMethod, {
  paymentMethodOptions,
} from 'childs/lib/constant/order/paymentMethod';

/**
 * 결제정보 섹션에서 결제 수단별 상세정보
 *
 * 디자인 - 주문내역 상세
 * zpl://screen?sid=5cf4945716309e0a5cbfa3f5&pid=5ca71f1be141ada0c0df7152
 */
const PaymentAccountInfo = ({
  wrapperStyle = {},
  payment = {
    amount: 2878,
    cardQuota: null,
    cashReceiptNo: 0,
    cashReceiptType: null,
    cashReceiptUsage: null,
    completeAt: null,
    completeTimestamp: null,
    method: null, // 카드결제 - 카드회사 이름
    mobileCorp: null,
    mobileNo: null,
    mobileVanCd: null,
    parentMethod: 'VBank', // 결제 수단 enum
    paymentStatus: 'WAITING_PAYMENT',
    pointPayment: 1122,
    requestAt: [2019, 9, 30, 18, 17, 23],
    requestTimestamp: 1569867443000,
    vbankBankName: '우체국',
    vbankDepositorName: null,
    vbankExpireAt: [2019, 10, 2, 0, 0],
    vbankExpireTimestamp: 1569974400000,
    vbankNo: '85085080009553',
    vbankRemitterName: '우체국',
  },
}) => {
  const paymentMethodText =
    paymentMethodOptions.find(o => o.value === payment?.parentMethod)?.label ||
    '';

  return (
    <div className={css.wrap} style={wrapperStyle}>
      <div className={css.row}>
        <span className={css.label}>결제수단</span>
        <span className={css.value}>{paymentMethodText}</span>
      </div>

      {/* 무통장 입금  */}
      {payment.parentMethod === paymentMethod.VBANK.code && (
        <>
          <div className={css.row}>
            <span className={css.label}>입금계좌</span>
            <span className={css.value}>
              {payment.vbankBankName} {payment.vbankNo}
            </span>
          </div>
          <div className={css.row}>
            <span className={css.label}>입금기한</span>
            <span className={css.value} style={{ color: '#ce2525' }}>{`${moment(
              payment.vbankExpireTimestamp
            ).format(`${dateFormat.YYYYMMDD_UI} HH:mm`)} 까지`}</span>
          </div>
        </>
      )}

      {/* 카드 결제 */}
      {payment.parentMethod === paymentMethod.CARD.code && (
        <>
          <div className={css.row}>
            <span className={css.label}>카드정보</span>
            <span className={css.value}>{payment.method}</span>
          </div>
          <div className={css.row}>
            <span className={css.label}>승인일시</span>
            <span className={css.value}>
              {moment(
                payment.completeTimestamp || payment.requestTimestamp
              ).format(`${dateFormat.YYYYMMDD_UI} HH:mm`)}
            </span>
          </div>
        </>
      )}

      {/* 실시간 계좌이체 */}
      {payment.parentMethod === paymentMethod.DIRECT_BANK.code && (
        <>
          <div className={css.row}>
            <span className={css.label}>이체일시</span>
            <span className={css.value}>
              {moment(
                payment.completeTimestamp || payment.requestTimestamp
              ).format(`${dateFormat.YYYYMMDD_UI} HH:mm`)}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentAccountInfo;
