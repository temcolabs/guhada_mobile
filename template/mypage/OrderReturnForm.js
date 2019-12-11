import React, { Component } from 'react';
import { withRouter } from 'next/router';
import MypageLayout from 'components/mypage/MypageLayout';

/**
 * 주문 반품 신청 및 수정 페이지.
 *
 * TODO: form values 초기화 메소드 수정
 * TODO: form validators
 */
@withRouter
class OrderReturnForm extends Component {
  render() {
    return (
      <MypageLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        headerShape={'mypage'}
      >
        <div>주문 반품 신청 및 수정 페이지.</div>
      </MypageLayout>
    );
  }
}

export default OrderReturnForm;
