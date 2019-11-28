import React, { Component } from 'react';
import Head from 'next/head';
import ProductLikeList from 'template/mypage/ProductLikeList';
import withAuth from 'components/common/hoc/withAuth';

class ProductLikeListPage extends Component {
  render() {
    return (
      <>
        <Head>
          <title>마이페이지</title>
        </Head>

        <ProductLikeList />
      </>
    );
  }
}

export default withAuth({ isAuthRequired: true })(ProductLikeListPage);
