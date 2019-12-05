import React, { useEffect, useState, useMemo } from 'react';
import css from './RefundInfo.module.scss';
import cn from 'classnames';
import addCommaToNum from 'childs/lib/common/addCommaToNum';
import { useObserver } from 'mobx-react-lite';
import nilToZero from 'childs/lib/common/nilToZero';
import { paymentMethodOptions } from 'childs/lib/constant/order/paymentMethod';
import { observer } from 'mobx-react';
import { compose } from 'lodash/fp';

const enhancer = compose(observer);

/**
 * 환불금액 정보
 *
 * 신청 양식에서는 /order-claim/refund-price API를 통해 가져오고
 * 신청 완료 페이지에서는 claim-complete-form API를 사용한다
 *
 * http://dev.claim.guhada.com/swagger-ui.html#/ORDER-CLAIM/getClaimCompleteFormUsingGET
 */
function RefundInfo({
  isRefundExpectation = false, // 환불금액 or 환불예상금액

  // OrderClaimUpdateResponse.refundResponse
  refundResponse = {
    totalCancelDiscountPrice: 0, // 상품 주문할인 취소
    totalCancelOrderPrice: 0, // 취소상품 주문금액
    totalCancelProductPrice: 0, // 취소상품 금액합계
    totalCancelShipPrice: 0, // 취소 배송비 합계
    totalPaymentCancelPrice: 0, // 신용카드 환불금액
    totalPointCancelPrice: 0, // 포인트 환불금액
  },
  paymentMethodText = '', // 결제 수단 텍스트
}) {
  // 결제 방법이 한글 텍스트가 아닌 enum으로 오는 케이스가 있음(신청 페이지)
  // 옵션에서 찾을 수 있으면 대체하고, 아니면 전달된 값을 그대로 사용한다.
  const paymentMethodTextInView =
    paymentMethodOptions.find(o => o.value === paymentMethodText)?.label ||
    paymentMethodText;

  return (
    <div className={css.wrap}>
      <div className={cn(css.row, css.totalPayments)}>
        <div
          className={cn(
            css.column,
            css.column_1_3,
            css.withMinus,
            css.withBorderRight
          )}
        >
          <div className={cn(css.totalPrice)}>
            <span className={css.label}>주문금액</span>
            <span className={css.value}>
              {addCommaToNum(
                nilToZero(refundResponse?.totalCancelProductPrice)
              )}
              원
            </span>
          </div>

          <div className={cn(css.totalPriceDetail)}>
            <span className={css.label}>상품 금액</span>
            <span className={css.value}>
              {addCommaToNum(
                nilToZero(refundResponse?.totalCancelProductPrice)
              )}
              원
            </span>
          </div>

          <div className={cn(css.totalPriceDetail)}>
            <span className={css.label}>배송비</span>
            <span className={css.value}>
              {addCommaToNum(nilToZero(refundResponse?.totalCancelShipPrice))}원
            </span>
          </div>
        </div>

        {/* 환불금액 차감내역은 기획에서 빠짐. 취소상품 주문금액 = 환불 예상금액이라서 0을 넣어도 상관없음 */}
        <div
          className={cn(
            css.column,
            css.column_1_3,
            css.withEqual,
            css.withBorderRight
          )}
        >
          <div className={cn(css.totalPrice)}>
            <span className={css.label}>차감금액</span>
            <span className={css.value}>
              {addCommaToNum(refundResponse?.totalCancelDiscountPrice)}원
            </span>
          </div>

          <div className={cn(css.totalPriceDetail)}>
            <span className={css.label}>할인금액</span>
            <span className={css.value}>
              {addCommaToNum(
                nilToZero(refundResponse?.totalCancelDiscountPrice)
              )}
              원
            </span>
          </div>
          {/*
          <div className={cn(css.totalPriceDetail)}>
            <span className={css.label}>취소・반품비용 차감</span>
            <span className={css.value}>{addCommaToNum(nilToZero(0))}원</span>
          </div> */}
        </div>

        <div className={cn(css.column, css.column_1_3)}>
          <div className={cn(css.totalPrice, css.red)}>
            <span className={css.label}>환불 예정 금액</span>
            <span className={css.value}>
              {// * 최종 결제금액과 동일한 값이 되어야 한다
              addCommaToNum(nilToZero(refundResponse?.totalCancelOrderPrice))}
              원
            </span>
          </div>

          <div className={cn(css.totalPriceDetail)}>
            {/* 결제 수단에 따라 텍스트 달라짐 */}
            <span className={css.label}>
              {paymentMethodTextInView && `${paymentMethodTextInView} `}최종
              결제금액
            </span>
            <span className={css.value}>
              {addCommaToNum(
                nilToZero(refundResponse?.totalPaymentCancelPrice)
              )}
              원
            </span>
          </div>
          <div className={cn(css.totalPriceDetail)}>
            <span className={css.label}>포인트 사용</span>
            <span className={css.value}>
              {addCommaToNum(nilToZero(refundResponse?.totalPointCancelPrice))}
              원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default enhancer(RefundInfo);
