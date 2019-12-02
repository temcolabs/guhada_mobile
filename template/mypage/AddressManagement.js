import React, { Component } from 'react';
import { withRouter } from 'next/router';
import MypageLayout from 'components/mypage/MypageLayout';
import { inject, observer } from 'mobx-react';
@inject('mypageAddress')
@observer
class AddressManagement extends Component {
  render() {
    return (
      <MypageLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        headerShape={'mypage'}
      >
        <div>배송지 관리</div>
      </MypageLayout>
    );
  }
}

export default AddressManagement;
