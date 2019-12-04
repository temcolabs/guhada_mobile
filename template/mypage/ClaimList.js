import React from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';

import MypageLayout from 'components/mypage/MypageLayout';

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
      <MypageLayout>
        <div>OrderExchangeDone</div>
      </MypageLayout>
    </DefaultLayout>
  );
}
