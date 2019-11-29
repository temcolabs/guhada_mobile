import React, { Component } from 'react';
import { withRouter } from 'next/router';
import css from './AddressManagement.module.scss';
import DefaultLayout from 'components/layout/DefaultLayout';
import MypageLayout from 'components/mypage/MypageLayout';
import MypageAddressList from 'components/mypage/address/MypageAddressList';
import MypageAddressModal from 'components/mypage/address/MypageAddressModal';
import { inject, observer } from 'mobx-react';
@inject('mypageAddress')
@observer
class AddressManagement extends Component {
  componentDidMount() {
    this.props.mypageAddress.getAddressList();
  }
  render() {
    let { mypageAddress } = this.props;
    return (
      <DefaultLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        toolBar={false}
        headerShape={'mypage'}
      >
        <MypageLayout>
          <div className={css.wrap}>
            <div
              className={css.newAddress}
              onClick={() => {
                mypageAddress.newAddressModal();
              }}
            >
              신규배송지 등록
            </div>

            <MypageAddressList />

            <MypageAddressModal isOpen={mypageAddress.isModalOpen} />
          </div>
        </MypageLayout>
      </DefaultLayout>
    );
  }
}

export default AddressManagement;
