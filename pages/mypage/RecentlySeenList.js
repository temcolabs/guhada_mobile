import React, { Component } from 'react';
import Head from 'next/head';
import RecentlySeenList from 'template/mypage/RecentlySeenList';
import withAuth from 'components/common/hoc/withAuth';

class RecentlySeenListPage extends Component {
  render() {
    return (
      <>
        <Head>
          <title>마이페이지</title>
        </Head>

        <RecentlySeenList />
      </>
    );
  }
}

export default withAuth({ isAuthRequired: true })(RecentlySeenListPage);
