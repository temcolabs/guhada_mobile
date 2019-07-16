import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './OrderResult.module.scss';
@inject('orderpaymentsuccess', 'user')
@observer
class OrderResult extends Component {
  render() {
    let { orderpaymentsuccess } = this.props;
    let {
      orderSuccessAmount,
      orderSuccessPayment,
      orderTotalQuantity,
    } = orderpaymentsuccess;
    return (
      <div className={css.wrap}>
        <div className={css.resultWrap}>
          <div className={css.totalOrderAmount}>
            <div className={css.resultAmountSection}>
              <div className={css.bigTitle}>총 주문금액</div>
              <div className={css.bigAmount}>{`${(
                orderSuccessAmount.totalProdPrice +
                orderSuccessAmount.totalShipPrice
              ).toLocaleString()}원`}</div>
            </div>
            <div className={css.resultAmountSection}>
              <div className={css.title}>배송비</div>
              <div
                className={css.amount}
              >{`${orderSuccessAmount.totalShipPrice.toLocaleString()}원`}</div>
            </div>
          </div>

          <div className={css.totalDiscountAmount}>
            <div className={css.resultAmountSection}>
              <div className={css.bigTitle}>총 할인금액</div>
              <div
                className={css.bigAmount}
              >{`${orderSuccessAmount.totalDiscountDiffPrice.toLocaleString()}원`}</div>
            </div>
            <div className={css.resultAmountSection}>
              <div className={css.title}>쿠폰 할인</div>
              <div className={css.amount}>0원</div>
            </div>
            <div className={css.resultAmountSection}>
              <div className={css.title}>상품 할인</div>
              <div className={css.amount}>0원</div>
            </div>
            <div className={css.resultAmountSection}>
              <div className={css.title}>포인트 사용</div>
              <div
                className={css.amount}
              >{`${orderSuccessPayment.pointPayment.toLocaleString()}원`}</div>
            </div>
          </div>

          <div className={css.totalPaymentAmount}>
            <div className={css.resultAmountSection}>
              <div className={css.bigTitle}>최종 결제금액</div>
              <div className={css.bigAmount}>
                {`${orderSuccessAmount.totalPaymentPrice.toLocaleString()}`}
                <span>원</span>
              </div>
            </div>
          </div>

          <div className={css.savePoint}>
            <div className={css.resultAmountSection}>
              <div className={css.bigTitle}>
                적립 예정 내역
                <span>
                  <img src="/static/icon/m_dropdown_arrow.png" alt="드랍다운" />
                </span>
              </div>
              <div className={css.bigAmount}>590,000</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderResult;
