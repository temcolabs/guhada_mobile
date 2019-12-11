import React, { Component } from 'react';
import MypageLayout from 'components/mypage/MypageLayout';

class UserInfomation extends Component {
  render() {
    return (
      <MypageLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        headerShape={'mypage'}
      >
        <div>주문내역 상세</div>
      </MypageLayout>
    );
  }
}

export default UserInfomation;
