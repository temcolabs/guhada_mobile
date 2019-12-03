import React, { Component } from 'react';
import { withRouter } from 'next/router';
<<<<<<< HEAD
import css from './AddressManagement.module.scss';
import DefaultLayout from 'components/layout/DefaultLayout';
=======
>>>>>>> develop
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
      <MypageLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        headerShape={'mypage'}
      >
<<<<<<< HEAD
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
=======
        <div>배송지 관리</div>
      </MypageLayout>
>>>>>>> develop
    );
  }
}

export default AddressManagement;
