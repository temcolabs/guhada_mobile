import React, { useEffect, useCallback, useMemo } from 'react';
import css from './OrderCancelDone.module.scss';
import ModalLayout from 'components/layout/ModalLayout';
import ClaimSuccessNotiBox from 'components/mypage/orderCancel/ClaimSuccessNotiBox';
import SectionHeading from 'components/common/SectionHeading';
import SubmitButton, {
  SubmitButtonWrapper,
} from 'components/mypage/form/SubmitButton';
import addCommaToNum from 'childs/lib/common/addCommaToNum';
import Link from 'next/link';
import getRouteHref from 'childs/lib/router/getRouteHref';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import { withRouter } from 'next/router';
import { compose } from 'lodash/fp';
import useStores from 'stores/useStores';
import purchaseStatus from 'childs/lib/constant/order/purchaseStatus';
import ClaimOrderTableAtDone from 'components/mypage/claim/ClaimOrderTableAtDone';
import { observer } from 'mobx-react';
import nilToZero from 'childs/lib/common/nilToZero';
import Router from 'next/router';
const enhancer = compose(
  withScrollToTopOnMount,
  withRouter,
  observer
);
/**
 */
function OrderCancelDone({ router }) {
  const { orderClaimId, orderClaimGroupId } = router.query;
  const { orderClaimForm } = useStores();
  const { claimData } = orderClaimForm;
  const close = () => {
    Router.push('/mypage/orders/claim/list');
  };
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
      판매자에게 주문 상품의 <b>주문 취소가 요청</b>되었습니다.
    </span>
  );

  const headingOnComplete = () => (
    <span>
      주문 상품의 <b>주문취소가 완료</b>되었습니다.
    </span>
  );

  const notiBoxHeading =
    claimData?.claimStatus === purchaseStatus.REQUEST_CANCEL.code
      ? headingOnRequest
      : claimData?.claimStatus === purchaseStatus.COMPLETE_CANCEL.code
      ? headingOnComplete
      : headingOnComplete;

  // 상단 박스 설명 파트
  const notiBoxDesc = useMemo(() => {
    return () => (
      <div>
        <div className={css.refundCharge}>
          <span>
            <b>
              환불 예정 금액{' '}
              {addCommaToNum(
                nilToZero(claimData?.refundResponse?.totalCancelOrderPrice)
              )}
              원
            </b>
          </span>
          <span className={css.refundCharge__method}>
            ({claimData?.paymentMethodText}{' '}
            {addCommaToNum(
              nilToZero(claimData?.refundResponse?.totalPaymentCancelPrice)
            )}
            원)
          </span>
        </div>
        <div>
          결제 수단에 따라 결제 환불 기간이 차이가 날 수 있습니다.
          <br />
          주문상품의 취소 처리 현황은 취소 ・ 교환 ・ 반품에서 확인하실 수
          있습니다.
        </div>
      </div>
    );
  }, [claimData]);
  return (
    <ModalLayout onClose={close}>
      <ClaimSuccessNotiBox heading={notiBoxHeading} />

      <ClaimOrderTableAtDone />

      {notiBoxDesc}
      <SubmitButtonWrapper wrapperStyle={{ marginTop: '60px' }}>
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
