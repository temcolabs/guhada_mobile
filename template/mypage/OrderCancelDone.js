import React from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';
import { compose } from 'lodash/fp';
import MyPageLayout from 'components/mypage/MyPageLayout';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import { observer } from 'mobx-react';

const enhancer = compose(
  withScrollToTopOnMount,
  withRouter,
  observer
);
/**
 */
function OrderCancelDone({ router }) {
  const { orderClaimId, orderClaimGroupId } = router.query;
  return (
    <DefaultLayout
      topLayout={'main'}
      pageTitle={'마이페이지'}
      toolBar={false}
      headerShape={'mypage'}
    >
      <MyPageLayout>
        <div>주문 취소 완료</div>
      </MyPageLayout>
    </DefaultLayout>
  );
}

export default enhancer(OrderCancelDone);
