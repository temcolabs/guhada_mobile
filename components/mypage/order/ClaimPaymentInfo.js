import React from 'react';
import css from './PaymentInfo.module.scss';
import cn from 'classnames';
import addCommaToNum from 'childs/lib/common/addCommaToNum';
import nilToZero from 'childs/lib/common/nilToZero';

/**
 * 클레임 상세 페이지의 결제 정보.
 *
 * http://dev.claim.guhada.com/swagger-ui.html#/ORDER-CLAIM/getClaimCompleteFormUsingGET
 *
 * 주문 상세 페이지의 결제 정보에는 복수의 상품의 합산.
 * * 클레임 상세 페이지는 클레임을 요청한 1개의 상품에 대한 결제 정보
 */
export default function ClaimPaymentInfo({ claimData = {} }) {
  const wrapperRef = React.useRef();

  const getWrapperHeight = () => {
    return wrapperRef.current?.getBoundingClientRect()?.height;
  };

  return (
    <div className={css.wrap} ref={wrapperRef}>
      <div className={cn(css.row, css.totalPayments)}>
        {/* 총 주문금액 */}
        <div
          className={cn(
            css.column,
            css.column_1_3,
            css.withMinus,
            css.withBorderRight
          )}
          style={{ height: getWrapperHeight() }}
        >
          <div className={cn(css.totalPrice)}>
            <span className={css.label}>주문금액</span>
            <span className={css.value}>
              {/* 상품합계 + 배송비 */}
              {addCommaToNum(claimData?.originalPrice)}원
            </span>
          </div>

          <div className={cn(css.totalPriceDetail)}>
            <span className={css.label}>상품합계</span>
            <span className={css.value}>
              {addCommaToNum(claimData?.originalPrice)}원
            </span>
          </div>
          <div className={cn(css.totalPriceDetail)}>
            <span className={css.label}>배송비</span>
            <span className={css.value}>
              {addCommaToNum(claimData?.shipPrice)}원
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
          style={{ height: getWrapperHeight() }}
        >
          <div className={cn(css.totalPrice)}>
            <span className={css.label}>할인 · 포인트</span>
            <span className={css.value}>
              {addCommaToNum(
                nilToZero(claimData?.discountDiffPrice) +
                  nilToZero(claimData?.couponDiscount) +
                  nilToZero(claimData?.pointPayment)
              )}
              원
            </span>
          </div>

          {/* 할인금액 영역의 쿠폰, 포인트 정보 */}
          <div className={cn(css.totalPriceDetail)}>
            <span className={css.label}>상품 할인</span>
            <span className={css.value}>
              {addCommaToNum(nilToZero(claimData?.discountDiffPrice))}원
            </span>
          </div>
          <div className={cn(css.totalPriceDetail)}>
            <span className={css.label}>쿠폰 할인</span>
            <span className={css.value}>
              {addCommaToNum(nilToZero(claimData?.couponDiscount))}원
            </span>
          </div>
          <div className={cn(css.totalPriceDetail)}>
            <span className={css.label}>포인트 사용</span>
            <span className={css.value}>
              {addCommaToNum(nilToZero(claimData?.pointPayment))}원
            </span>
          </div>
        </div>

        {/* 총 결제금액 */}
        <div
          className={cn(css.column, css.column_1_3)}
          style={{ height: getWrapperHeight() }}
        >
          <div className={cn(css.totalPrice)}>
            <span className={css.label}>최종 결제금액</span>
            <span className={css.value}>
              {/* 할인된 금액 + 배송비 */}
              {addCommaToNum(claimData?.orderPrice)}원
            </span>
          </div>
          <div className={cn(css.totalPriceDetail)}>
            {/* 결제금액 + 결제 수단 */}
            <span className={css.label}>
              {claimData?.paymentMethodText || '결제'}
            </span>
            <span className={css.value}>
              {addCommaToNum(claimData?.orderPrice)}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
