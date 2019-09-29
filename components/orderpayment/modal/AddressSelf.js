import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './AddressSelf.module.scss';
import addHyphenToMobile from 'lib/string/addHyphenToMobile';
@inject('orderpayment')
@observer
class AddressSelf extends Component {
  render() {
    let { orderpayment } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.section}>
          <div className={css.title}>배송지명</div>
          <div className={css.value}>
            <input
              type="text"
              placeholder="배송지명"
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
          <div className={css.title}>우편번호</div>
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
            우편번호검색
          </div>
        </div>
        <div className={css.section}>
          <div className={css.title}>주소</div>
          <div className={css.value}>
            <input
              type="text"
              id="newAddress"
              placeholder="주소"
              readOnly
              value={
                orderpayment.orderShippingList.newAddress.roadAddress || ''
              }
            />
          </div>
        </div>
        <div className={css.section}>
          <div className={css.title} />
          <div className={css.value}>
            <input
              type="text"
              placeholder="상세주소"
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
          <div className={css.title}>받는분</div>
          <div className={css.value}>
            <input
              type="text"
              placeholder="받는분"
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
          <div className={css.title}>연락처</div>
          <div className={css.value}>
            <input
              type="text"
              placeholder="연락처"
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
              defaultChecked={
                orderpayment.orderShippingList.isAddShippingAddress
              }
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
              defaultChecked={
                orderpayment.orderShippingList.newAddress.defaultAddress
              }
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
