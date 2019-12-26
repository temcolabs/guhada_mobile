import React, { Component } from 'react';
import Head from 'next/head';
import UserInfomation from 'template/mypage/UserInfomation';
import withAuth from 'components/common/hoc/withAuth';

class UserInfomationPage extends Component {
  render() {
    return (
      <>
        <Head>
          <title>회원정보 수정</title>
        </Head>

        <UserInfomation />
      </>
    );
  }
}

export default withAuth({ isAuthRequired: true })(UserInfomationPage);
