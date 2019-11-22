import React, { Component } from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';

import MyPageLayout from 'components/mypage/MyPageLayout';

class MyReviewList extends Component {
  render() {
    return (
      <DefaultLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        toolBar={false}
        headerShape={'mypage'}
      >
        <MyPageLayout>
          <div>MyReviewList</div>
        </MyPageLayout>
      </DefaultLayout>
    );
  }
}

export default MyReviewList;
