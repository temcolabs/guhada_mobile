import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import css from './ShippingAddress.module.scss';
import ShippingMessageSelect from './ShippingMessageSelect';
import AddressChangeModal from './modal/AddressChangeModal';
import addHyphenToMobile from 'childs/lib/string/addHyphenToMobile';
import { devLog } from 'childs/lib/common/devLog';
import _ from 'lodash';
@inject('orderpayment')
@observer
class ShippingAddress extends Component {
  render() {
    let { orderpayment } = this.props;
    let address = orderpayment.orderShippingList?.defaultAddress;
    return (
      <div className={css.wrap}>
        <div className={css.top}>
          <div className={css.title}>배송지</div>
          <div
            className={css.changeAddress}
            onClick={() => {
              orderpayment.shippingListModal();
            }}
          >
            배송지 변경
            <span className={css.arrow} />
          </div>
        </div>
        {_.isEmpty(address) ? (
          <div>배송지가 없습니다.</div>
        ) : (
          <Fragment>
            <div className={css.shippingAddressWrap}>
              <div className={css.shippingAddressItem}>
                <div className={css.shippingName}>
                  {address.shippingName}
                  {address.defaultAddress ? (
                    <span className={css.defaultAddresss} />
                  ) : null}
                </div>
                <div className={css.shippingAddress}>
                  {`[${address.zip}] ${address.roadAddress ||
                    address.address} ${address.detailAddress}`}
                </div>
                <div className={css.shippingCustomer}>
                  <div className={css.recipientName}>
                    {address.recipientName}
                  </div>
                  <div className={css.recipientMobile}>
                    {addHyphenToMobile(address.recipientMobile)}
                  </div>
                </div>
              </div>
            </div>

            <div className={css.selectBox}>
              <ShippingMessageSelect />
            </div>

            {orderpayment.status.shppingRequestSelfStatus ? (
              <div className={css.shippingMessageRequest}>
                <textarea
                  onChange={event => {
                    orderpayment.selfShippingRequestOption(event, '기본배송');
                  }}
                  placeholder="50자 내외로 입력해주세요"
                  maxLength="50"
                  value={
                    orderpayment?.orderShippingList?.defaultAddress
                      ?.shippingMessage || ''
                  }
                />
              </div>
            ) : null}
          </Fragment>
        )}

        <AddressChangeModal
          isVisible={orderpayment.status.shppingListModalStatus}
        />
      </div>
    );
  }
}

export default ShippingAddress;
