import React from 'react';
import css from './PaymentInfo.module.scss';
import cn from 'classnames';
import addCommaToNum from 'childs/lib/common/addCommaToNum';
import nilToZero from 'childs/lib/common/nilToZero';
import MypageSectionTitle from 'components/mypage/MypageSectionTitle';
import PaymentAccountInfo from './PaymentAccountInfo';

/**
 * 클레임 상세 페이지의 결제 정보.
 *
 * http://dev.claim.guhada.com/swagger-ui.html#/ORDER-CLAIM/getClaimCompleteFormUsingGET
 *
 * 주문 상세 페이지의 결제 정보에는 복수의 상품의 합산.
 * * 클레임 상세 페이지는 클레임을 요청한 1개의 상품에 대한 결제 정보
 */
export default function ClaimPaymentInfo({ claimData = {} }) {
  return (
    <div className={css.wrap}>
      <MypageSectionTitle>결제 정보</MypageSectionTitle>

      <div className={cn(css.sectionWrap)}>
        {/* 총 주문금액 */}
        <div className={cn(css.section)}>
          <div className={cn(css.section__field, css.isHeading)}>
            <span className={cn(css.section__label)}>주문금액</span>
            <span className={css.section__value}>
              {/* 상품합계 + 배송비 */}
              {addCommaToNum(claimData?.originalPrice)}원
            </span>
          </div>

          <div className={cn(css.section__field)}>
            <span className={css.section__label}>상품합계</span>
            <span className={css.section__value}>
              {addCommaToNum(claimData?.originalPrice)}원
            </span>
          </div>
          <div className={cn(css.section__field)}>
            <span className={css.section__label}>배송비</span>
            <span className={css.section__value}>
              {addCommaToNum(claimData?.shipPrice)}원
            </span>
          </div>
        </div>

        {/* 총 할인금액 */}
        <div className={cn(css.section)}>
          <div className={cn(css.section__field, css.isHeading)}>
            <span className={css.section__label}>할인 · 포인트</span>
            <span className={css.section__value}>
              {/* 쿠폰+포인트+상품 할인 합계*/}
              <span>- </span>
              {addCommaToNum(
                nilToZero(claimData?.discountDiffPrice) +
                  nilToZero(claimData?.couponDiscount) +
                  nilToZero(claimData?.pointPayment)
              )}
              원
            </span>
          </div>

          {/* 할인금액 영역의 쿠폰, 포인트 정보 */}
          <div className={cn(css.section__field)}>
            <span className={css.section__label}>상품할인</span>
            <span className={css.section__value}>
              <span>- </span>
              <span>
                {addCommaToNum(nilToZero(claimData?.discountDiffPrice))}원
              </span>
            </span>
          </div>

          <div className={cn(css.section__field)}>
            <span className={css.section__label}>장바구니 쿠폰</span>
            <span className={css.section__value}>
              <span>- </span>
              {addCommaToNum(nilToZero(claimData?.couponDiscount))}원
            </span>
          </div>

          <div className={cn(css.section__field)}>
            <span className={css.section__label}>포인트 사용</span>
            <span className={css.section__value}>
              <span>- </span>
              {addCommaToNum(nilToZero(claimData?.pointPayment))}원
            </span>
          </div>
        </div>

        {/* 총 결제금액 */}
        <div className={cn(css.section)}>
          <div className={cn(css.section__field, css.isHeading, css.isTotal)}>
            <span className={css.section__label}>총 결제금액</span>
            <span className={css.section__value}>
              {/* 할인된 금액 + 배송비 */}
              {addCommaToNum(claimData?.orderPrice)}원
            </span>
          </div>
          <div className={cn(css.section__field)}>
            <span className={css.section__label}>
              {claimData?.paymentMethodText || '결제'}
            </span>
            <span className={css.section__value}>
              {/* 할인된 금액 + 배송비 */}
              {addCommaToNum(claimData?.orderPrice)}원
            </span>
          </div>

          {/* 결제금액 + 결제 수단 */}
          <div className={cn(css.section__field)}>
            <PaymentAccountInfo payment={claimData?.order?.payment} />
          </div>
        </div>
      </div>
    </div>
  );
}
