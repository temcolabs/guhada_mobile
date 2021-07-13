import { Component } from 'react';
import Head from 'next/head';
import CouponList from 'template/mypage/CouponList';
import withAuth from 'components/common/hoc/withAuth';

class CouponListPage extends Component {
  render() {
    return (
      <>
        <Head>
          <title>마이페이지</title>
        </Head>

        <CouponList />
      </>
    );
  }
}

export default withAuth({ isAuthRequired: true })(CouponListPage);
