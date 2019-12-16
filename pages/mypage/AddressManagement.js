import React, { Component } from 'react';
import Head from 'next/head';
import AddressManagement from 'template/mypage/AddressManagement';
import withAuth from 'components/common/hoc/withAuth';

@withAuth({ isAuthRequired: true })
class AddressManagementPage extends Component {
  render() {
    return (
      <>
        <Head>
          <title>마이페이지</title>
        </Head>
        <AddressManagement />
      </>
    );
  }
}

export default AddressManagementPage;
