import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './AddressSelf.module.scss';
import addHyphenToMobile from 'childs/lib/string/addHyphenToMobile';
@inject('orderpayment')
@observer
class AddressSelf extends Component {
  render() {
    let { orderpayment } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.section}>
          <div className={css.value}>
            <input
              type="text"
              placeholder="배송지명을 입력해주세요"
              onChange={e => {
                orderpayment.setNewShippingAddress(e, 'newShippingName', null);
              }}
              value={
                orderpayment.orderShippingList.newAddress.shippingName || ''
              }
            />
          </div>
        </div>
        <div className={css.section}>
          <div className={css.value}>
            <input
              type="text"
              id="new__zipCode"
              placeholder="우편번호"
              readOnly
              value={orderpayment.orderShippingList.newAddress.zip || ''}
              onClick={() => {
                orderpayment.searchZipcode(
                  '주문페이지-신규',
                  null,
                  orderpayment.setNewShippingAddress
                );
              }}
            />
          </div>
          <div
            className={css.zipcode}
            onClick={() => {
              orderpayment.searchZipcode(
                '주문페이지-신규',
                null,
                orderpayment.setNewShippingAddress
              );
            }}
          >
            우편번호찾기
          </div>
        </div>
        <div className={css.section}>
          <div className={css.value}>
            <input
              type="text"
              id="newAddress"
              placeholder="주소"
              readOnly
              onClick={() => {
                orderpayment.searchZipcode(
                  '주문페이지-신규',
                  null,
                  orderpayment.setNewShippingAddress
                );
              }}
              value={
                orderpayment.orderShippingList.newAddress.zip
                  ? `${
                      orderpayment.addressType === 'R'
                        ? orderpayment.orderShippingList.newAddress
                            .roadAddress ||
                          orderpayment.orderShippingList.newAddress.address ||
                          ''
                        : orderpayment.orderShippingList.newAddress.address ||
                          orderpayment.orderShippingList.newAddress
                            .roadAddress ||
                          ''
                    }`
                  : null
              }
            />
          </div>
        </div>
        <div className={css.section}>
          <div className={css.value}>
            <input
              type="text"
              placeholder="상세주소를 입력해주세요"
              onChange={e => {
                orderpayment.setNewShippingAddress(e, 'newDetailAddress', null);
              }}
              value={
                orderpayment.orderShippingList.newAddress.detailAddress || ''
              }
            />
          </div>
        </div>
        <div className={css.section}>
          <div className={css.value}>
            <input
              type="text"
              placeholder="수령인을 입력해주세요"
              onChange={e => {
                orderpayment.setNewShippingAddress(e, 'newRecipientName', null);
              }}
              value={
                orderpayment.orderShippingList.newAddress.recipientName || ''
              }
            />
          </div>
        </div>

        <div className={css.section}>
          <div className={css.value}>
            <input
              type="text"
              placeholder="연락처를 입력해주세요"
              maxLength="13"
              onChange={e => {
                orderpayment.setNewShippingAddress(
                  e,
                  'newRecipientMobile',
                  null
                );
              }}
              value={
                addHyphenToMobile(
                  orderpayment.orderShippingList.newAddress.recipientMobile
                ) || ''
              }
            />
          </div>
        </div>

        <div className={css.section}>
          <label>
            <input
              type="checkbox"
              onChange={e => {
                orderpayment.newAddressCheckbox(e, 'Notdefault');
              }}
              checked={orderpayment.orderShippingList.isAddShippingAddress}
            />
            <div className={css.checkBox} />
            <div className={css.labelTxt}>주문 완료 시 배송지 목록에 추가</div>
          </label>
        </div>

        <div className={css.section}>
          <label>
            <input
              type="checkbox"
              onChange={e => {
                orderpayment.newAddressCheckbox(e, 'default');
              }}
              checked={orderpayment.orderShippingList.newAddress.defaultAddress}
            />
            <div className={css.checkBox} />
            <div className={css.labelTxt}>기본 배송지로 설정</div>
          </label>
        </div>
      </div>
    );
  }
}

export default AddressSelf;
