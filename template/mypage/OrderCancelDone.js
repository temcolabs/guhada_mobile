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
import nilToZero from 'lib/common/nilToZero';
import Router from 'next/router';
import MypageSectionTitle from 'components/mypage/MypageSectionTitle';

const enhancer = compose(withScrollToTopOnMount, withRouter, observer);

function OrderCancelDone({ router }) {
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
      <b>취소가 요청</b>되었습니다.
    </span>
  );

  const headingOnComplete = () => (
    <span>
      주문 상품의 <b>취소</b>가
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

  return (
    <ModalLayout isOpen={isModalLayoutOpen} onClose={closeModalLayout}>
      <div className={css.wrap}>
        <ClaimSuccessNotiBox heading={notiBoxHeading} />

        <div className={css.orderItemsWrap}>
          <ClaimOrderTableAtDone />
        </div>

        <div className={css.sectionsWrap}>
          <div className={css.section}>
            <MypageSectionTitle>환불 예정 금액</MypageSectionTitle>
            <div className={css.section__content}>
              <span>
                {addCommaToNum(
                  nilToZero(claimData?.refundResponse?.totalCancelOrderPrice)
                )}
                원
              </span>

              <span>&nbsp;</span>

              <span>
                ({claimData?.paymentMethodText}{' '}
                {addCommaToNum(
                  nilToZero(claimData?.refundResponse?.totalPaymentCancelPrice)
                )}
                원)
              </span>
            </div>
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
    </ModalLayout>
  );
}

export default enhancer(OrderCancelDone);
