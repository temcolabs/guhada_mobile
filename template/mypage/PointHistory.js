import React from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';

import MyPageLayout from 'components/mypage/MyPageLayout';

@withRouter
class PointHistory extends React.Component {
  render() {
    return (
      <DefaultLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        toolBar={false}
        headerShape={'mypage'}
      >
        <MyPageLayout>
          <div>포인트 히스토리</div>
        </MyPageLayout>
      </DefaultLayout>
    );
  }
}

export default PointHistory;
