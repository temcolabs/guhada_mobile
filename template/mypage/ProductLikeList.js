import React from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';

import MyPageLayout from 'components/mypage/MyPageLayout';

@withRouter
class ProductLikeList extends React.Component {
  render() {
    return (
      <DefaultLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        toolBar={false}
        headerShape={'mypage'}
      >
        <MyPageLayout>
          <div>상품 찜한 상품</div>
        </MyPageLayout>
      </DefaultLayout>
    );
  }
}

export default ProductLikeList;
