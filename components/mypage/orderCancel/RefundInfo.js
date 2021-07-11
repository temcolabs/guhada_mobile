import React, { useMemo, useReducer } from 'react';
import css from './RefundInfo.module.scss';
import cn from 'classnames';
import addCommaToNum from 'childs/lib/common/addCommaToNum';
import nilToZero from 'childs/lib/common/nilToZero';
import { paymentMethodOptions } from 'childs/lib/constant/order/paymentMethod';
import MypageSectionTitle from '../MypageSectionTitle';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';

/**
 * 환불금액 정보
 *
 * 신청 양식에서는 /order-claim/refund-price API를 통해 가져오고
 * 신청 완료 페이지에서는 claim-complete-form API를 사용한다
 *
 * http://dev.claim.guhada.com/swagger-ui.html#/ORDER-CLAIM/getClaimCompleteFormUsingGET
 */
function RefundInfo({
  // 섹션 열고 닫기가 가능한지
  isCollapsingEnabled = true,
}) {
  const { orderClaimForm } = useStores();

  const { paymentMethodText, refundResponse } = orderClaimForm;

  // 결제 방법이 한글 텍스트가 아닌 enum으로 오는 케이스가 있음(신청 페이지)
  // 옵션에서 찾을 수 있으면 대체하고, 아니면 전달된 값을 그대로 사용한다.
  const paymentMethodTextInView =
    paymentMethodOptions.find((o) => o.value === paymentMethodText)?.label ||
    paymentMethodText;

  const collapsingName = useMemo(
    () => ({
      ORDER_PRICE: 'ORDER_PRICE',
      DISCOUNT_PRICE: 'DISCOUNT_PRICE',
      TOTAL_PRICE: 'TOTAL_PRICE',
    }),
    []
  );

  // 닫힘 영역 토글 리듀서
  const [collapsingState, dispatch] = useReducer(
    (state, { name = collapsingName.ORDER_PRICE }) => {
      return {
        ...state,
        [name]: !state[name],
      };
    },
    {
      [collapsingName.ORDER_PRICE]: true,
      [collapsingName.DISCOUNT_PRICE]: true,
      [collapsingName.TOTAL_PRICE]: true,
    }
  );

  return (
    <div className={css.wrap}>
      <MypageSectionTitle>환불 정보</MypageSectionTitle>

      {/* 주문 금액 */}
      <div className={cn(css.sectionWrap)}>
        <div
          className={cn(css.section, {
            [css.isClosed]: collapsingState[collapsingName.ORDER_PRICE],
          })}
        >
          <div
            className={cn(css.section__field, css.isHeading)}
            onClick={() => dispatch({ name: collapsingName.ORDER_PRICE })}
          >
            <span className={css.section__label}>주문금액</span>
            <span className={css.section__value}>
              {addCommaToNum(
                nilToZero(refundResponse?.totalCancelProductPrice)
              )}
              원
            </span>
          </div>

          <div className={cn(css.section__field)}>
            <span className={css.section__label}>상품 금액</span>
            <span className={css.section__value}>
              {addCommaToNum(
                nilToZero(refundResponse?.totalCancelProductPrice)
              )}
              원
            </span>
          </div>

          <div className={cn(css.section__field)}>
            <span className={css.section__label}>배송비</span>
            <span className={css.section__value}>
              {addCommaToNum(nilToZero(refundResponse?.totalCancelShipPrice))}원
            </span>
          </div>
        </div>

        {/* 환불금액 차감내역은 기획에서 빠짐. 취소상품 주문금액 = 환불 예상금액이라서 0을 넣어도 상관없음 */}
        <div
          className={cn(css.section, {
            [css.isClosed]: collapsingState[collapsingName.DISCOUNT_PRICE],
          })}
        >
          <div
            className={cn(css.section__field, css.isHeading)}
            onClick={() => dispatch({ name: collapsingName.DISCOUNT_PRICE })}
          >
            <span className={css.section__label}>차감금액</span>
            <span className={css.section__value}>
              {addCommaToNum(refundResponse?.totalCancelDiscountPrice)}원
            </span>
          </div>

          <div className={cn(css.section__field)}>
            <span className={css.section__label}>할인금액</span>
            <span className={css.section__value}>
              {addCommaToNum(
                nilToZero(refundResponse?.totalCancelDiscountPrice)
              )}
              원
            </span>
          </div>
        </div>

        {/* 환불 예정 금액 */}
        <div
          className={cn(css.section, {
            [css.isClosed]: collapsingState[collapsingName.TOTAL_PRICE],
          })}
        >
          <div
            className={cn(css.section__field, css.isHeading, css.isRed)}
            onClick={() => dispatch({ name: collapsingName.TOTAL_PRICE })}
          >
            <span className={css.section__label}>환불 예정 금액</span>
            <span className={css.section__value}>
              {// * 최종 결제금액과 동일한 값이 되어야 한다
              addCommaToNum(nilToZero(refundResponse?.totalCancelOrderPrice))}
              원
            </span>
          </div>

          <div className={cn(css.section__field)}>
            {/* 결제 수단에 따라 텍스트 달라짐 */}
            <span className={css.section__label}>
              {paymentMethodTextInView && `${paymentMethodTextInView} `}최종
              결제금액
            </span>
            <span className={css.section__value}>
              {addCommaToNum(
                nilToZero(refundResponse?.totalPaymentCancelPrice)
              )}
              원
            </span>
          </div>
          <div className={cn(css.section__field)}>
            <span className={css.section__label}>포인트 사용</span>
            <span className={css.section__value}>
              {addCommaToNum(nilToZero(refundResponse?.totalPointCancelPrice))}
              원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(RefundInfo);
