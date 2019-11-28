import React, { Component } from 'react';
import Head from 'next/head';
import PointHistory from 'template/mypage/PointHistory';
import withAuth from 'components/common/hoc/withAuth';

class PointHistoryPage extends Component {
  render() {
    return (
      <>
        <Head>
          <title>마이페이지 - 포인트</title>
        </Head>

        <PointHistory />
      </>
    );
  }
}

export default withAuth({ isAuthRequired: true })(PointHistoryPage);
