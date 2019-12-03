import React, { Component } from 'react';
import MypageLayout from 'components/mypage/MypageLayout';

/**
 * 팔로우 스토어
 */
class FollowStoreList extends Component {
  render() {
    return (
      <MypageLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        headerShape={'mypage'}
      >
        <div>팔로우 스토어</div>
      </MypageLayout>
    );
  }
}

export default FollowStoreList;
