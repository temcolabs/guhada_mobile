import React from 'react';
import css from './MypageAddressList.module.scss';
import { inject, observer } from 'mobx-react';
import addHyphenToMobile from 'childs/lib/string/addHyphenToMobile';

@inject('mypageAddress')
@observer
class MypageAddressList extends React.Component {
  render() {
    let { mypageAddress, data } = this.props;

    return (
      <div className={css.wrap}>
        <div className={css.addressItem}>
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
              {`[${data?.zip}] ${data?.roadAddress} ${data?.detailAddress}`}
            </div>
          </div>

          <div className={css.section}>
            <div className={css.customer}>{`${
              data.recipientName
            } ${addHyphenToMobile(data.recipientMobile)}`}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default MypageAddressList;
