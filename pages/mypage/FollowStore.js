import { Component } from 'react';
import Head from 'next/head';
import FollowStoreList from 'template/mypage/FollowStoreList';
import withAuth from 'components/common/hoc/withAuth';

class FollowStore extends Component {
  render() {
    return (
      <>
        <Head>
          <title>팔로우한 스토어</title>
        </Head>

        <FollowStoreList />
      </>
    );
  }
}

export default withAuth({ isAuthRequired: true })(FollowStore);
