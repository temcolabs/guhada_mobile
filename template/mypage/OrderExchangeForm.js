import React, { Component } from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';

import MypageLayout from 'components/mypage/MypageLayout';

/**
 * 주문 교환 신청 및 수정 페이지.
 *
 * TODO: form values 초기화 메소드 수정
 * TODO: form validators
 */
@withRouter
class OrderExchangeForm extends Component {
  render() {
    return (
      <DefaultLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        toolBar={false}
        headerShape={'mypage'}
      >
        <MypageLayout>
          <div>주문 교환 신청 및 수정 페이지</div>
        </MypageLayout>
      </DefaultLayout>
    );
  }
}

export default OrderExchangeForm;
