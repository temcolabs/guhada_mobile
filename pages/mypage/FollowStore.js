import React, { Component } from 'react';
import Head from 'next/head';
import FollowStoreList from 'template/mypage/FollowStoreList';
import withAuth from 'components/common/hoc/withAuth';

class FollowStore extends Component {
  render() {
    return (
      <>
        <Head>
          <title>마이페이지</title>
        </Head>

        <FollowStoreList />
      </>
    );
  }
}

export default withAuth({ isAuthRequired: true })(FollowStore);
