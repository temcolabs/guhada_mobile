import React, { Component } from 'react';
import { withRouter } from 'next/router';
import css from './AddressManagement.module.scss';
import DefaultLayout from 'components/layout/DefaultLayout';
import MypageLayout from 'components/mypage/MypageLayout';
import MypageAddressList from 'components/mypage/address/MypageAddressList';
import MypageAddressModal from 'components/mypage/address/MypageAddressModal';
import DataEmpty from 'components/common/DataEmpty';
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
        headerShape={'mypage'}
      >
        <MypageLayout>
          <div className={css.wrap}>
            {mypageAddress.addressList.length > 0 ? (
              <>
                <div
                  className={css.newAddress}
                  onClick={() => {
                    mypageAddress.newAddressModal();
                  }}
                >
                  신규배송지 등록
                </div>
                {mypageAddress.addressList.map((data, index) => {
                  return <MypageAddressList data={data} key={index} />;
                })}
              </>
            ) : (
              <>
                <DataEmpty text="등록된 배송지가 없습니다." MARGINTOP="80px" />
                <div
                  className={css.addressRegister}
                  onClick={() => {
                    mypageAddress.newAddressModal();
                  }}
                >
                  신규배송지 등록
                </div>
              </>
            )}

            <MypageAddressModal isOpen={mypageAddress.isModalOpen} />
          </div>
        </MypageLayout>
      </DefaultLayout>
    );
  }
}

export default AddressManagement;
