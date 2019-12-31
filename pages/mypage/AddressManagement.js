import React, { Component } from 'react';
import Head from 'next/head';
import AddressManagement from 'template/mypage/AddressManagement';
import withAuth from 'components/common/hoc/withAuth';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';

@withScrollToTopOnMount
@withAuth({ isAuthRequired: true })
class AddressManagementPage extends Component {
  render() {
    return (
      <>
        <Head>
          <title>배송지 관리</title>
        </Head>
        <AddressManagement />
      </>
    );
  }
}

export default AddressManagementPage;
