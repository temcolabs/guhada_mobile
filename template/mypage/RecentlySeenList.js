import React from 'react';
import { withRouter } from 'next/router';
import MypageLayout from 'components/mypage/MypageLayout';

@withRouter
class RecentlySeenList extends React.Component {
  render() {
    return (
      <MypageLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        headerShape={'mypage'}
      >
        <div>최근본 상품</div>
      </MypageLayout>
    );
  }
}

export default RecentlySeenList;
