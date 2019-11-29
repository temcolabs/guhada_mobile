import React from 'react';
import css from './MypageAddressList.module.scss';
import { inject, observer } from 'mobx-react';
import addHyphenToMobile from 'childs/lib/string/addHyphenToMobile';
import DataEmpty from 'components/common/DataEmpty';
@inject('mypageAddress')
@observer
class MypageAddressList extends React.Component {
  render() {
    let { mypageAddress } = this.props;

    return (
      <div className={css.wrap}>
        {mypageAddress.addressList.length > 0 ? (
          mypageAddress.addressList.map((data, index) => {
            return (
              <div className={css.addressItem} key={index}>
                <div className={css.section}>
                  <div className={css.addressTitleWrap}>
                    <div className={css.title}>
                      {data.shippingName ? data.shippingName : ''}
                    </div>
                    {data.defaultAddress ? (
                      <div className={css.defaultAddress} />
                    ) : null}
                  </div>

                  <div className={css.utilButton}>
                    <div
                      onClick={() => {
                        mypageAddress.editAddressModal(data.id);
                      }}
                    >
                      수정
                    </div>
                    <div
                      onClick={() => {
                        mypageAddress.deleteAddress(data.id);
                      }}
                    >
                      삭제
                    </div>
                  </div>
                </div>

                <div className={css.section}>
                  <div className={css.address}>
                    {`[${data.zip}] ${data.roadAddress} ${data.detailAddress}`}
                  </div>
                </div>

                <div className={css.section}>
                  <div className={css.customer}>{`${
                    data.recipientName
                  } ${addHyphenToMobile(data.recipientMobile)}`}</div>
                </div>
              </div>
            );
          })
        ) : (
          <DataEmpty text="등록된 배송지가 없습니다." />
        )}
      </div>
    );
  }
}

export default MypageAddressList;
