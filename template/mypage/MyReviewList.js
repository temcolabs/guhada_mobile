import React, { Component } from 'react';
import MypageLayout from 'components/mypage/MypageLayout';

class MyReviewList extends Component {
  render() {
    return (
      <MypageLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}

        headerShape={'mypage'}
      >
        <div>MyReviewList</div>
      </MypageLayout>
    );
  }
}

export default MyReviewList;
