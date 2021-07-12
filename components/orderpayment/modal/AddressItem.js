import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './AddressItem.module.scss';
import addHyphenToMobile from 'lib/string/addHyphenToMobile';
@inject('orderpayment')
@observer
class AddressItem extends Component {
  render() {
    let { orderpayment } = this.props;
    let tempEditAddress = orderpayment.orderShippingList.tempEditAddress;
    return orderpayment.orderShippingList.list.map((data, index) => {
      return orderpayment.orderShippingList.currentEditAddressId === data.id ? (
        <div className={css.wrap} key={index}>
          <div className={css.radioWrap}>
            <label>
              <input
                type="radio"
                name="address"
                value={data.id}
                onChange={() => {
                  orderpayment.shippingAddressChange(data.id);
                }}
                checked={
                  orderpayment.orderShippingList.currentUseAddressId === data.id
                }
              />
              <div />
            </label>
          </div>

          <div className={css.sectionWrap}>
            <div className={css.section}>
              <div className={css.addressTitleWrap}>
                <div className={css.addressTitle}>
                  <input
                    type="text"
                    value={tempEditAddress.shippingName}
                    onChange={(e) => {
                      orderpayment.addressEditing(e, 'shippingName', null);
                    }}
                  />
                </div>
                {data.defaultAddress ? (
                  <div className={css.defaultAddress} />
                ) : null}
              </div>

              <div className={css.utilButton}>
                <div
                  onClick={() => {
                    orderpayment.addressEditSave(data.id);
                  }}
                >
                  저장
                </div>
                <div
                  onClick={() => {
                    orderpayment.addressEditCancel();
                  }}
                >
                  취소
                </div>
              </div>
            </div>

            <div className={css.section}>
              <input
                type="text"
                value={tempEditAddress.zip}
                id="edit__zipCode"
                onClick={() => {
                  orderpayment.searchZipcode(
                    '주문페이지-수정',
                    orderpayment.addressEditing,
                    null
                  );
                }}
                readOnly
              />
              <button
                className={css.searchZipcode}
                onClick={() => {
                  orderpayment.searchZipcode(
                    '주문페이지-수정',
                    orderpayment.addressEditing,
                    null
                  );
                }}
              >
                우편번호찾기
              </button>
            </div>

            <div className={css.section}>
              <input
                type="text"
                value={
                  tempEditAddress.zip
                    ? `${`(우:${tempEditAddress.zip})`} ${
                        orderpayment.addressType === 'R'
                          ? tempEditAddress.roadAddress ||
                            tempEditAddress.address ||
                            ''
                          : tempEditAddress.address ||
                            tempEditAddress.roadAddress ||
                            ''
                      }`
                    : null
                }
                readOnly
                onClick={() => {
                  orderpayment.searchZipcode(
                    '주문페이지-수정',
                    orderpayment.addressEditing,
                    null
                  );
                }}
              />
            </div>

            <div className={css.section}>
              <input
                type="text"
                onChange={(e) => {
                  orderpayment.addressEditing(e, 'detailAddress', null);
                }}
                value={tempEditAddress.detailAddress}
              />
            </div>

            <div className={css.section}>
              <input
                type="text"
                onChange={(e) => {
                  orderpayment.addressEditing(e, 'recipientName', null);
                }}
                value={tempEditAddress.recipientName}
              />
            </div>

            <div className={css.section}>
              <input
                type="text"
                onChange={(e) => {
                  orderpayment.addressEditing(e, 'recipientMobile', null);
                }}
                value={addHyphenToMobile(tempEditAddress.recipientMobile)}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={css.wrap} key={index}>
          <div className={css.radioWrap}>
            <label>
              <input
                type="radio"
                name="address"
                value={data.id}
                onChange={() => {
                  orderpayment.shippingAddressChange(data.id);
                }}
                checked={
                  orderpayment.orderShippingList.currentUseAddressId === data.id
                }
              />
              <div />
            </label>
          </div>

          <div className={css.sectionWrap}>
            <div className={css.section}>
              <div className={css.addressTitleWrap}>
                <div
                  className={
                    orderpayment.orderShippingList.currentUseAddressId ===
                    data.id
                      ? css.selectedTitle
                      : css.title
                  }
                >
                  {data.shippingName ? data.shippingName : ''}
                </div>
                {data.defaultAddress ? (
                  <div className={css.defaultAddress} />
                ) : null}
              </div>

              <div className={css.utilButton}>
                <div
                  onClick={() => {
                    orderpayment.addressEdit(data.id);
                  }}
                >
                  수정
                </div>
                <div
                  onClick={() => {
                    orderpayment.addressDeleteConfirm(data.id);
                  }}
                >
                  삭제
                </div>
              </div>
            </div>

            <div className={css.section}>
              <div className={css.address}>
                {`[${data.zip}] ${data.roadAddress || data.address} ${
                  data.detailAddress
                }`}
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
    });
  }
}

export default AddressItem;
