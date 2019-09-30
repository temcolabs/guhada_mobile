import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './OrderResult.module.scss';
@inject('orderpaymentsuccess', 'user')
@observer
class OrderResult extends Component {
  state = {
    dueSavePoint: false,
  };
  dueSavePointHandler = () => {
    this.setState({
      dueSavePoint: !this.state.dueSavePoint,
    });
  };
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
              <div className={css.bigTitle}>상품금액</div>
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
              <div className={css.bigTitle}>할인 ∙ 포인트</div>
              <div
                className={css.bigAmount}
              >{`${orderSuccessAmount.couponPointProdDiscountPrice?.toLocaleString()}원`}</div>
            </div>
            <div className={css.resultAmountSection}>
              <div className={css.title}>쿠폰 할인</div>
              <div
                className={css.amount}
              >{`${orderSuccessAmount.couponDiscountPrice?.toLocaleString()}원`}</div>
            </div>
            <div className={css.resultAmountSection}>
              <div className={css.title}>상품 할인</div>
              <div
                className={css.amount}
              >{`${orderSuccessAmount.totalDiscountDiffPrice?.toLocaleString()}원`}</div>
            </div>
            <div className={css.resultAmountSection}>
              <div className={css.title}>포인트 사용</div>
              <div
                className={css.amount}
              >{`${orderSuccessAmount.totalPointPayment.toLocaleString()}원`}</div>
            </div>
          </div>

          <div className={css.totalPaymentAmount}>
            <div className={css.bigTitle}>최종 결제금액</div>
            <div className={css.bigAmount}>
              {`${orderSuccessAmount.totalAmount.toLocaleString()}`}
              <span>원</span>
            </div>
          </div>

          <div className={css.savePoint}>
            <div
              className={css.resultAmountSection}
              onClick={() => {
                this.dueSavePointHandler();
              }}
            >
              <div className={css.bigTitle}>
                적립 예정 내역
                <div
                  style={
                    this.state.dueSavePoint
                      ? { transform: 'rotateX(180deg)' }
                      : { transform: 'rotateX(0deg)' }
                  }
                />
              </div>
              <div className={css.dueSavePoint}>
                <span>최대</span>
                <strong>{` ${orderpaymentsuccess.totalDueSavePoint.toLocaleString()} `}</strong>
                <span>P</span>
              </div>
            </div>
            {this.state.dueSavePoint ? (
              <div className={css.dueSavePointDetail}>
                <div className={css.duesave__point__value}>
                  <div className={css.type}>구매 확정</div>
                  <div className={css.point}>
                    {orderpaymentsuccess.dueSavePoint.buy.toLocaleString() || 0}
                    <span>P</span>
                  </div>
                </div>
                <div className={css.duesave__point__value}>
                  <div className={css.type}>텍스트 리뷰</div>
                  <div className={css.point}>
                    {orderpaymentsuccess.dueSavePoint.text.toLocaleString() ||
                      0}
                    <span>P</span>
                  </div>
                </div>
                <div className={css.duesave__point__value}>
                  <div className={css.type}>포토 리뷰</div>
                  <div className={css.point}>
                    {orderpaymentsuccess.dueSavePoint.photo.toLocaleString() ||
                      0}
                    <span>P</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default OrderResult;
