import React, { Component } from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';

import MypageLayout from 'components/mypage/MypageLayout';

/**
 * 팔로우 스토어
 */
class FollowStoreList extends Component {
  render() {
    return (
      <DefaultLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        toolBar={false}
        headerShape={'mypage'}
      >
        <MypageLayout>
          <div>팔로우 스토어</div>
        </MypageLayout>
      </DefaultLayout>
    );
  }
}

export default FollowStoreList;
