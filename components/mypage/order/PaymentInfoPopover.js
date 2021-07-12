import React, { useState } from 'react';
import css from './PaymentInfoPopover.module.scss';
import moment from 'moment';
import { dateFormat } from 'lib/constant';
import cn from 'classnames';
import paymentMethod, {
  paymentMethodOptions,
} from 'lib/constant/order/paymentMethod';
import { devLog } from 'lib/common/devLog';
/**
 * 결제정보 i 아이콘 팝오버. 결제 정보를 포함한다.
 * order-complete API 의 결제 정보 객체
 *
 * 디자인 - 주문내역 상세
 * zpl://screen?pid=5ca71f1be141ada0c0df7152&sid=5cf4945716309e0a5cbfa3f5
 *
 * @param {} param0
 */
const PaymentInfoPopover = ({
  wrapperStyle = {},
  payment = {
    amount: 2878,
    cardQuota: null,
    cashReceiptNo: 0,
    cashReceiptType: null,
    cashReceiptUsage: null,
    completeAt: null,
    completeTimestamp: null,
    method: null,
    mobileCorp: null,
    mobileNo: null,
    mobileVanCd: null,
    parentMethod: 'VBank',
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
  const [isVisible, setIsVisible] = useState(false);

  const isVbank = payment.parentMethod === paymentMethod.VBANK.code;

  return (
    <div className={css.wrap} style={wrapperStyle}>
      <div
        className={css.infoIcon}
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(true);
        }}
      />

      <div className={cn(css.paymentInfoPopup, { [css.isVisible]: isVisible })}>
        <div className={css.paymentInfoHeader}>
          <div className={css.title}>결제정보</div>
          <div className={css.closeBtn} onClick={() => setIsVisible(false)}>
            <img
              src="/public/icon/payment_info_close.png"
              alt="결제정보 닫기버튼"
            />
          </div>
        </div>
        <div className={css.paymentInfoBody}>
          <div className={css.paymentMethod}>
            {
              paymentMethodOptions.find((o) => o.value === payment.parentMethod)
                ?.label
            }
          </div>

          {/* 무통장 입금 입금계좌번호 */}
          {isVbank ? (
            <div className={css.paymentDetail}>
              <span>{payment.vbankBankName}</span>
              <span>{payment.vbankNo}</span>
            </div>
          ) : (
            <div className={css.paymentDetail}>
              <span>{payment.method}</span>
              {/* <span>{payment.vbankNo}</span> */}
            </div>
          )}
        </div>

        {/* 결제 날짜 */}
        <div className={css.paymentDate}>
          {isVbank
            ? `${moment(payment.vbankExpireTimestamp).format(
                `${dateFormat.YYYYMMDD_UI} HH:mm`
              )} 까지`
            : `(${moment(
                payment.requestTimestamp || payment.completeTimestamp
              ).format(`${dateFormat.YYYYMMDD_UI} HH:mm`)})`}
        </div>
      </div>
    </div>
  );
};

export default PaymentInfoPopover;
