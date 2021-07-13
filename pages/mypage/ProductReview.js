import { Component } from 'react';
import Head from 'next/head';
import MyReviewList from 'template/mypage/MyReviewList';
import withAuth from 'components/common/hoc/withAuth';

/**
 * 마이페이지 상품 리뷰
 */
class ProductReview extends Component {
  render() {
    return (
      <>
        <Head>
          <title>상품 리뷰</title>
        </Head>
        <MyReviewList />
      </>
    );
  }
}

export default withAuth({ isAuthRequired: true })(ProductReview);
