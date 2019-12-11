import React, { useEffect, useCallback } from 'react';
import css from './OrderCancelDone.module.scss';
import ModalLayout, {
  useModalLayoutState,
} from 'components/layout/ModalLayout';
import ClaimSuccessNotiBox from 'components/mypage/orderCancel/ClaimSuccessNotiBox';
import SubmitButton, {
  SubmitButtonWrapper,
} from 'components/mypage/form/SubmitButton';
import Link from 'next/link';
import getRouteHref from 'childs/lib/router/getRouteHref';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import { withRouter } from 'next/router';
import { compose } from 'lodash/fp';
import useStores from 'stores/useStores';
import purchaseStatus from 'childs/lib/constant/order/purchaseStatus';
import ClaimOrderTableAtDone from 'components/mypage/claim/ClaimOrderTableAtDone';
import { observer } from 'mobx-react';
import Router from 'next/router';
import MypageSectionTitle from 'components/mypage/MypageSectionTitle';
import addHyphenToMobile from 'childs/lib/string/addHyphenToMobile';
import addCommaToNum from 'childs/lib/common/addCommaToNum';

const enhancer = compose(
  withScrollToTopOnMount,
  withRouter,
  observer
);

function OrderCancelDone({ router }) {
  const { orderClaimId, orderClaimGroupId } = router.query;
  const { orderClaimForm } = useStores();
  const { claimData } = orderClaimForm;

  const { isModalLayoutOpen, closeModalLayout } = useModalLayoutState({
    isOpenOnMount: true,
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
      <b>교환 신청이 요청</b>되었습니다.
    </span>
  );

  const headingOnComplete = () => (
    <span>
      주문 상품의 <b>교환신청</b>이
      <br />
      완료되었습니다.
    </span>
  );

  const notiBoxHeading =
    claimData?.claimStatus === purchaseStatus.REQUEST_EXCHANGE.code
      ? headingOnRequest
      : claimData?.claimStatus === purchaseStatus.COMPLETE_EXCHANGE.code
      ? headingOnComplete
      : headingOnComplete;

  // 교환 송장번호가 없는지?
  const noInvoice = !claimData?.exchangePickingInvoiceNo;

  return (
    <ModalLayout isOpen={isModalLayoutOpen} onClose={closeModalLayout}>
      <div className={css.wrap}>
        <ClaimSuccessNotiBox heading={notiBoxHeading} />

        <div className={css.orderItemsWrap}>
          <ClaimOrderTableAtDone />
        </div>

        <div className={css.sectionsWrap}>
          <div className={css.section}>
            <MypageSectionTitle>교환 반송지</MypageSectionTitle>
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
            <MypageSectionTitle>교환 발송 여부</MypageSectionTitle>
            <div className={css.section__content}>
              {noInvoice ? (
                '발송 전'
              ) : (
                <div>
                  <span>{orderClaimForm.getShipCompanyLabelFromClaim()}</span>

                  <span>{claimData?.exchangePickingInvoiceNo}</span>
                </div>
              )}
            </div>

            {!noInvoice && <div className={css.section__content} />}
          </div>

          <div className={css.section}>
            <MypageSectionTitle>교환배송비 결제</MypageSectionTitle>

            <div className={css.section__content}>
              {/* 사용자가 부담해야할 경우에만 배송비 부담방식 표시한다 */}
              {claimData?.userFault ? (
                <div>
                  교환사유 "<b>{orderClaimForm.claimShippingChargeLabel}</b>
                  "으로 인해 교환배송비{' '}
                  <b>{addCommaToNum(claimData?.exchangeShippingPrice)}</b>
                  원을 <b>{claimData?.exchangeShippingPriceTypeText}</b>으로
                  구매자가 부담합니다.
                </div>
              ) : (
                <div>판매자가 부담합니다.</div>
              )}
            </div>
          </div>

          <div className={css.section}>
            <MypageSectionTitle>교환상품 배송지</MypageSectionTitle>
            <div className={css.section__content}>
              <div>
                {claimData?.exchangeBuyerRoadAddress ||
                  claimData?.exchangeBuyerAddress}{' '}
                {claimData?.exchangeBuyerDetailAddress}
              </div>

              <div>
                <span>{claimData?.exchangeBuyerRecipientName}</span>
                <span>
                  {addHyphenToMobile(claimData?.exchangeBuyerRecipientMobile)}
                </span>
              </div>
            </div>
            <div className={css.section__content}>
              {claimData?.exchangeBuyerShippingMessage}
            </div>
          </div>
        </div>

        <SubmitButtonWrapper wrapperStyle={{ marginTop: '60px' }}>
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

export default enhancer(OrderCancelDone);
