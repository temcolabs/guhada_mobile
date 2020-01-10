import React from 'react';
import css from './PaymentInfo.module.scss';
import cn from 'classnames';
import addCommaToNum from 'childs/lib/common/addCommaToNum';
import { ORDER_COMPLETE_SAMPLE } from 'childs/lib/constant/order/orderModel';
import PaymentAccountInfo from './PaymentAccountInfo';
import MypageSectionTitle from 'components/mypage/MypageSectionTitle';

/**
 * 주문 상세 페이지의 결제 정보
 * @param {*} param0
 */
export default function PaymentInfo({ order = ORDER_COMPLETE_SAMPLE }) {
  return (
    <div className={css.wrap}>
      <MypageSectionTitle>결제 정보</MypageSectionTitle>

      <div className={css.sectionWrap}>
        {/* 총 주문금액 */}
        <div className={cn(css.section)}>
          <div className={cn(css.section__field, css.isHeading)}>
            <span className={cn(css.section__label)}>주문금액</span>
            <span className={css.section__value}>
              {/* 상품합계 + 배송비 */}
              {addCommaToNum(order.totalOrderPrice)}원
            </span>
          </div>

          <div className={cn(css.section__field)}>
            <span className={css.section__label}>상품합계</span>
            <span className={css.section__value}>
              {addCommaToNum(order.totalProdPrice)}원
            </span>
          </div>
          <div className={cn(css.section__field)}>
            <span className={css.section__label}>배송비</span>
            <span className={css.section__value}>
              {addCommaToNum(order.totalShipPrice)}원
            </span>
          </div>
        </div>

        <div className={cn(css.section)}>
          {/* 총 할인금액 */}
          <div className={cn(css.section__field, css.isHeading)}>
            <span className={css.section__label}>할인</span>
            <span className={css.section__value}>
              {/* 쿠폰+포인트+상품 할인 합계*/}
              <span>- </span>
              {addCommaToNum(order.couponPointProdDiscountPrice)}원
            </span>
          </div>

          {/* 할인금액 영역의 쿠폰, 포인트 정보 */}
          <div className={cn(css.section__field)}>
            <span className={css.section__label}>상품할인</span>
            <span className={css.section__value}>
              <span>- </span>
              <span>{addCommaToNum(order.totalDiscountDiffPrice)}원</span>
            </span>
          </div>
          <div className={cn(css.section__field)}>
            <span className={css.section__label}>쿠폰</span>
            <span className={css.section__value}>
              <span>- </span>
              {addCommaToNum(order.couponDiscountPrice)}원
            </span>
          </div>
          <div className={cn(css.section__field)}>
            <span className={css.section__label}>포인트 사용</span>
            <span className={css.section__value}>
              <span>- </span>
              {addCommaToNum(order.totalPointPayment)}원
            </span>
          </div>
        </div>

        {/* 총 결제금액 */}
        <div className={cn(css.section)}>
          <div className={cn(css.section__field, css.isHeading, css.isTotal)}>
            <span className={css.section__label}>총 결제금액</span>
            <span className={css.section__value}>
              {addCommaToNum(order.totalAmount)}원
            </span>
          </div>

          {/* 결제금액 + 결제 수단 */}
          <div className={cn(css.section__field)}>
            <PaymentAccountInfo payment={order?.payment} />
          </div>
        </div>
      </div>
    </div>
  );
}
