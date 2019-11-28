import React from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';
import { compose } from 'lodash/fp';
import MypageLayout from 'components/mypage/MypageLayout';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';

const enhancer = compose(
  withScrollToTopOnMount,
  withRouter
);

function OrderExchangeDone({ router }) {
  const { orderClaimId, orderClaimGroupId } = router.query;

  return (
    <DefaultLayout
      topLayout={'main'}
      pageTitle={'마이페이지'}
      toolBar={false}
      headerShape={'mypage'}
    >
      <MypageLayout>
        <div>OrderExchangeDone</div>
      </MypageLayout>
    </DefaultLayout>
  );
}

export default enhancer(OrderExchangeDone);
