import React from 'react';
import { pushRoute } from 'childs/lib/router';
import withAuth from 'components/common/hoc/withAuth';

/**
 * /mypage 라우트
 * 주문배송 목록으로 보냄
 */

@withAuth({ isAuthRequired: true })
class MypageIndex extends React.Component {
  static async getInitialProps({ store }) {
    return {};
  }

  componentDidMount() {
    pushRoute(`/mypage/orders/complete/list`, { replace: true });
  }

  render() {
    return <div />;
  }
}

export default MypageIndex;
