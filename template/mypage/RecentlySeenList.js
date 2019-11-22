import React from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';

import MyPageLayout from 'components/mypage/MyPageLayout';

@withRouter
class RecentlySeenList extends React.Component {
  render() {
    return (
      <DefaultLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        toolBar={false}
        headerShape={'mypage'}
      >
        <MyPageLayout>
          <div>최근본 상품</div>
        </MyPageLayout>
      </DefaultLayout>
    );
  }
}

export default RecentlySeenList;
