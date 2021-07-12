import React, { useEffect, useCallback } from 'react';
import css from './OrderCancelDone.module.scss';
import ModalLayout, {
  useModalLayoutState,
} from 'components/layout/ModalLayout';
import ClaimSuccessNotiBox from 'components/mypage/orderCancel/ClaimSuccessNotiBox';
import SubmitButton, {
  SubmitButtonWrapper,
} from 'components/mypage/form/SubmitButton';
import addCommaToNum from 'lib/common/addCommaToNum';
import Link from 'next/link';
import getRouteHref from 'lib/router/getRouteHref';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import { withRouter } from 'next/router';
import { compose } from 'lodash/fp';
import useStores from 'stores/useStores';
import purchaseStatus from 'lib/constant/order/purchaseStatus';
import ClaimOrderTableAtDone from 'components/mypage/claim/ClaimOrderTableAtDone';
import { observer } from 'mobx-react';
import Router from 'next/router';
import MypageSectionTitle from 'components/mypage/MypageSectionTitle';
import addHyphenToMobile from 'lib/string/addHyphenToMobile';
import isTruthy, { isFalsey } from 'lib/common/isTruthy';

const enhancer = compose(withScrollToTopOnMount, withRouter, observer);

function OrderReturnDone({ router }) {
  const { orderClaimId, orderClaimGroupId } = router.query;
  const { orderClaimForm } = useStores();
  const { claimData } = orderClaimForm;

  const { isModalLayoutOpen, closeModalLayout } = useModalLayoutState({
    isModalOpen: true,
    onClose: useCallback(() => {
      Router.push('/mypage/orders/claim/list');
    }, []),
  });

  // claimId 할당하고 데이터 가져옴
  useEffect(() => {
    orderClaimForm.setClaimId({
      orderClaimGroupId,
      orderClaimId,
    });
    return () => {
      orderClaimForm.resetClaimData();
    };
  }, [orderClaimForm, orderClaimGroupId, orderClaimId]);

  // 상단 박스 헤딩 파트
  const headingOnRequest = () => (
    <span>
      <b>{orderClaimForm.claimReasonLabel}</b>으로 인해,
      <br />
      판매자에게 주문 상품의
      <br />
      <b>반품이 요청</b>되었습니다.
    </span>
  );

  const headingOnComplete = () => (
    <span>
      주문 상품의 <b>반품</b>이
      <br />
      완료되었습니다.
    </span>
  );

  const notiBoxHeading =
    claimData?.claimStatus === purchaseStatus.REQUEST_CANCEL.code
      ? headingOnRequest
      : claimData?.claimStatus === purchaseStatus.COMPLETE_CANCEL.code
      ? headingOnComplete
      : headingOnComplete;

  // 반품 송장번호가 없는지?
  const noReturnInvoice =
    isTruthy(claimData) && isFalsey(claimData?.returnPickingInvoiceNo);

  return (
    <ModalLayout isOpen={isModalLayoutOpen} onClose={closeModalLayout}>
      <div className={css.wrap}>
        <ClaimSuccessNotiBox heading={notiBoxHeading} />

        <div className={css.orderItemsWrap}>
          <ClaimOrderTableAtDone />
        </div>

        <div className={css.sectionsWrap}>
          <div className={css.section}>
            <MypageSectionTitle>반품 반송지</MypageSectionTitle>
            <div className={css.section__content}>
              <div>{orderClaimForm.sellerReturnAddressInView}</div>
              <div>
                <span>{claimData?.sellerName}</span>
                <span>
                  {addHyphenToMobile(claimData?.sellerReturnTelephone)}
                </span>
              </div>
            </div>
          </div>

          <div className={css.section}>
            <MypageSectionTitle>반품 발송 여부</MypageSectionTitle>
            <div className={css.section__content}>
              {noReturnInvoice ? (
                '발송 전'
              ) : (
                <div>
                  <span>{orderClaimForm.getShipCompanyLabelFromClaim()}</span>

                  <span>{claimData?.returnPickingInvoiceNo}</span>
                </div>
              )}
            </div>

            {!noReturnInvoice && <div className={css.section__content} />}
          </div>

          <div className={css.section}>
            <MypageSectionTitle>반품배송비 결제</MypageSectionTitle>

            <div className={css.section__content}>
              {/* 사용자가 부담해야할 경우에만 배송비 부담방식 표시한다 */}
              {claimData?.userFault ? (
                <div>
                  사유 "<b>{orderClaimForm.claimShippingChargeLabel}</b>
                  "으로 인해 배송비{' '}
                  <b>{addCommaToNum(claimData?.returnShippingPrice)}</b>
                  원을 <b>{claimData?.returnShippingPriceTypeText}</b>으로
                  구매자가 부담합니다.
                </div>
              ) : (
                <div>판매자가 부담합니다.</div>
              )}
            </div>
          </div>
        </div>

        <SubmitButtonWrapper fixedToBottom>
          <Link
            as={`/mypage/orders/claim/list`}
            href={getRouteHref(`/mypage/orders/claim/list`)}
          >
            <SubmitButton>확인</SubmitButton>
          </Link>
        </SubmitButtonWrapper>
      </div>
    </ModalLayout>
  );
}

export default enhancer(OrderReturnDone);
