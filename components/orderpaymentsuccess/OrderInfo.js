import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './OrderInfo.module.scss';
import addHyphenToMobile from 'childs/lib/string/addHyphenToMobile';
import copy from 'copy-to-clipboard';
@inject('orderpaymentsuccess', 'user', 'alert')
@observer
class OrderInfo extends Component {
  copyAccountToClipboard = vbankNo => {
    copy(vbankNo);

    this.props.alert.showAlert('계좌번호가 복사되었습니다.');
  };

  render() {
    let { orderpaymentsuccess } = this.props;
    let { orderSuccessShipping, successInfo } = orderpaymentsuccess;
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
          <div>
            {orderSuccessShipping?.message
              ? orderSuccessShipping?.message
              : '-'}
          </div>
        </div>
        <div className={css.orderInfoSection}>
          <div>결제수단</div>

          {successInfo.payment.parentMethod === 'Card' ? (
            <div>
              <div className={css.paymentMethod}>신용/체크카드</div>
              <div className={css.paymentInfo}>
                {successInfo.payment.method}
                {/* {successInfo.payment.cardQuota === '00' ? ` 일시불` : ` `} */}
              </div>
              <div className={css.paymentDate}>
                {orderpaymentsuccess.orderAt}
              </div>
            </div>
          ) : successInfo.payment.parentMethod === 'VBank' ? (
            <div>
              <div className={css.paymentMethod}>무통장입금</div>
              <div className={css.paymentInfo}>
                {`${successInfo.payment.vbankBankName} ${
                  successInfo.payment.vbankNo
                }`}
              </div>
              <div className={css.paymentInfo}>예금주 : (주)구하다</div>
              <div className={css.paymentDate}>
                {`${orderpaymentsuccess.vbankExpireAt} 까지`}
              </div>
            </div>
          ) : successInfo.payment.parentMethod === 'DirectBank' ? (
            <div>
              <div className={css.paymentMethod}>실시간 계좌이체</div>
              <div className={css.paymentInfo}>
                {successInfo.payment.method}
              </div>
              <div className={css.paymentDate}>
                {orderpaymentsuccess.orderAt}
              </div>
            </div>
          ) : successInfo.payment.parentMethod === 'TOKEN' ? (
            <div className={css.paymentMethod}>토큰결제</div>
          ) : null}
        </div>
        {successInfo.payment.parentMethod === 'VBank' ? (
          <div
            className={css.accountCopy}
            onClick={() => {
              this.copyAccountToClipboard(successInfo.payment.vbankNo);
            }}
          >
            계좌번호 복사
          </div>
        ) : null}
      </div>
    );
  }
}

export default OrderInfo;
