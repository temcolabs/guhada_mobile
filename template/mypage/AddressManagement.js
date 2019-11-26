import React, { Component } from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';

import MypageLayout from 'components/mypage/MypageLayout';
import { inject, observer } from 'mobx-react';
@inject('mypageAddress')
@observer
class AddressManagement extends Component {
  render() {
    return (
      <DefaultLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        toolBar={false}
        headerShape={'mypage'}
      >
        <MypageLayout>
          <div>배송지 관리</div>
        </MypageLayout>
      </DefaultLayout>
    );
  }
}

export default AddressManagement;
