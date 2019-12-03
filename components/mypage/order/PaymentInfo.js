import React from 'react';
import css from './PaymentInfo.module.scss';
import cn from 'classnames';
import addCommaToNum from 'childs/lib/common/addCommaToNum';
import { ORDER_COMPLETE_SAMPLE } from 'childs/lib/constant/order/orderModel';
import { paymentMethodOption } from 'childs/lib/constant/order/paymentMethod';
import PaymentAccountInfo from './PaymentAccountInfo';

/**
 * 주문 상세 페이지의 결제 정보
 * @param {*} param0
 */
export default function PaymentInfo({ order = ORDER_COMPLETE_SAMPLE }) {
  return (
    <div className={css.wrap}>
      <div className={cn(css.row, css.totalPayments)}>
        {/* 총 주문금액 */}
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
              {/* 상품합계 + 배송비 */}
              {addCommaToNum(order.totalOrderPrice)}원
            </span>
          </div>

          <div className={cn(css.totalPriceDetail)}>
            <span className={css.label}>상품합계</span>
            <span className={css.value}>
              {addCommaToNum(order.totalProdPrice)}원
            </span>
          </div>
          <div className={cn(css.totalPriceDetail)}>
            <span className={css.label}>배송비</span>
            <span className={css.value}>
              {addCommaToNum(order.shipExpenseTypeText)}원
            </span>
          </div>
        </div>

        {/* 총 할인금액 */}
        <div
          className={cn(
            css.column,
            css.column_1_3,
            css.withEqual,
            css.withBorderRight
          )}
        >
          <div className={cn(css.totalPrice)}>
            <span className={css.label}>할인 · 포인트</span>
            <span className={css.value}>
              {/* 쿠폰+포인트+상품 할인 합계*/}
              {addCommaToNum(order.couponPointProdDiscountPrice)}원
            </span>
          </div>

          {/* 할인금액 영역의 쿠폰, 포인트 정보 */}
          <div className={cn(css.totalPriceDetail)}>
            <span className={css.label}>상품할인</span>
            <span className={css.value}>
              {addCommaToNum(order.totalDiscountDiffPrice)}원
            </span>
          </div>
          <div className={cn(css.totalPriceDetail)}>
            <span className={css.label}>장바구니 쿠폰</span>
            <span className={css.value}>
              {addCommaToNum(order.cartCouponPrice)}원
            </span>
          </div>
          <div className={cn(css.totalPriceDetail)}>
            <span className={css.label}>프로모션 쿠폰</span>
            <span className={css.value}>
              {addCommaToNum(order.promotionCouponPrice)}원
            </span>
          </div>
          <div className={cn(css.totalPriceDetail)}>
            <span className={css.label}>포인트 사용</span>
            <span className={css.value}>
              {addCommaToNum(order.totalPointPayment)}원
            </span>
          </div>
        </div>

        {/* 총 결제금액 */}
        <div className={cn(css.column, css.column_1_3)}>
          <div className={cn(css.totalPrice)}>
            <span className={css.label}>총 결제금액</span>
            <span className={css.value}>
              {addCommaToNum(order.totalAmount)}원
            </span>
          </div>

          {/* 결제금액 + 결제 수단 */}
          <div className={cn(css.totalPriceDetail)}>
            <PaymentAccountInfo payment={order?.payment} />
          </div>
        </div>
      </div>
    </div>
  );
}
