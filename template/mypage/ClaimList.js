import React from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';

import MyPageLayout from 'components/mypage/MyPageLayout';

/**
 * 마이페이지 문의하기
 * @param {*} param0
 */
export default function ClaimList() {
  return (
    <DefaultLayout
      topLayout={'main'}
      pageTitle={'마이페이지'}
      toolBar={false}
      headerShape={'mypage'}
    >
      <MyPageLayout>
        <div>OrderExchangeDone</div>
      </MyPageLayout>
    </DefaultLayout>
  );
}
