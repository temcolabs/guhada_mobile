import React, { Component } from 'react';
import Head from 'next/head';
import ClaimList from 'template/mypage/ClaimList';
import withAuth from 'components/common/hoc/withAuth';

class ClaimPageMain extends Component {
  render() {
    return (
      <>
        <Head>
          <title>문의</title>
        </Head>

        <ClaimList />
      </>
    );
  }
}

export default withAuth({ isAuthRequired: true })(ClaimPageMain);
