import React from 'react';
import { withRouter } from 'next/router';
import { compose } from 'lodash/fp';
import MypageLayout from 'components/mypage/MypageLayout';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';

const enhancer = compose(
  withScrollToTopOnMount,
  withRouter
);

function OrderReturnDone({ router }) {
  const { orderClaimId, orderClaimGroupId } = router.query;

  return (
    <MypageLayout
      topLayout={'main'}
      pageTitle={'마이페이지'}
      headerShape={'mypage'}
    >
      <div>OrderReturnDone</div>
    </MypageLayout>
  );
}

export default enhancer(OrderReturnDone);
