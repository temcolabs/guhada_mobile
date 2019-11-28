import React from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';

import MypageLayout from 'components/mypage/MypageLayout';

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
        <MypageLayout>
          <div>최근본 상품</div>
        </MypageLayout>
      </DefaultLayout>
    );
  }
}

export default RecentlySeenList;
