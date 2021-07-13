import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './MypageAddressModal.module.scss';
import cn from 'classnames';
import addHyphenToMobile from 'lib/string/addHyphenToMobile';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
@inject('mypageAddress')
@observer
class MypageAddressModal extends Component {
  /**
   * 배송지 수정
   */
  renderEditModal() {
    const { mypageAddress } = this.props;

    return (
      <div className={css.modal}>
        <div className={css.modal__top}>
          <div className={css.modal__title}>배송지 수정</div>
          <div
            className={css.modal__close}
            onClick={() => {
              mypageAddress.addressModalClose();
            }}
          />
        </div>
        <div className={css.modal__body}>
          {mypageAddress.isNewAdressModal && (
            <div className={css.modal__body__title}>
              저장하신 배송지는 <span>배송지 관리</span>에서 수정 및 삭제가
              가능합니다.
            </div>
          )}

          <div className={css.modal__body__content}>
            <div className={css.section}>
              <div className={css.value}>
                <input
                  type="text"
                  onChange={(e) => {
                    mypageAddress.setEditAddress(e, 'shippingName');
                  }}
                  value={mypageAddress.editAddress.shippingName || ''}
                />
              </div>
            </div>
            <div className={css.section}>
              <div className={css.value}>
                <input
                  type="text"
                  value={mypageAddress.editAddress.zip || ''}
                  readOnly
                  onClick={() => {
                    mypageAddress.searchZipcode('edit');
                  }}
                />
              </div>
              <div
                className={css.zipcode}
                onClick={() => {
                  mypageAddress.searchZipcode('edit');
                }}
              >
                우편번호찾기
              </div>
            </div>
            <div className={css.section}>
              <div className={css.value}>
                <input
                  type="text"
                  readOnly
                  onClick={() => {
                    mypageAddress.searchZipcode('edit');
                  }}
                  value={
                    mypageAddress.addressType === 'R'
                      ? mypageAddress.editAddress.roadAddress || ''
                      : mypageAddress.editAddress.address || ''
                  }
                />
              </div>
            </div>
            <div className={css.section}>
              <div className={css.value}>
                <input
                  type="text"
                  value={mypageAddress.editAddress.detailAddress || ''}
                  onChange={(e) => {
                    mypageAddress.setEditAddress(e, 'detailAddress');
                  }}
                />
              </div>
            </div>
            <div className={css.section}>
              <div className={css.value}>
                <input
                  type="text"
                  value={mypageAddress.editAddress.recipientName || ''}
                  onChange={(e) => {
                    mypageAddress.setEditAddress(e, 'recipientName');
                  }}
                />
              </div>
            </div>

            <div className={css.section}>
              <div className={css.value}>
                <input
                  type="text"
                  value={
                    addHyphenToMobile(
                      mypageAddress.editAddress.recipientMobile
                    ) || ''
                  }
                  onChange={(e) => {
                    mypageAddress.setEditAddress(e, 'recipientMobile');
                  }}
                  maxLength="13"
                />
              </div>
            </div>

            <div className={css.section}>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    mypageAddress.setEditAddress(e, 'defaultCheck');
                  }}
                  checked={mypageAddress.defaultAddress}
                />
                <div className={css.checkBox} />
                <div className={css.labelTxt}>기본배송지 설정</div>
              </label>
            </div>
          </div>
        </div>

        <div
          className={css.modal__bottom}
          onClick={() => {
            mypageAddress.saveEditAddress();
          }}
        >
          수정 완료
        </div>
      </div>
    );
  }

  /**
   * 배송지 추가
   */
  renderCreateModal() {
    const { mypageAddress } = this.props;
    return (
      <div className={css.modal}>
        <div className={css.modal__top}>
          <div className={css.modal__title}>배송지 등록</div>
          <div
            className={css.modal__close}
            onClick={() => {
              mypageAddress.addressModalClose();
            }}
          />
        </div>
        <div className={css.modal__body}>
          <div className={css.modal__body__title}>
            저장하신 배송지는 <span>배송지 관리</span>에서 수정 및 삭제가
            가능합니다.
          </div>
          <div className={css.modal__body__content}>
            <div className={css.section}>
              <div className={css.value}>
                <input
                  type="text"
                  placeholder="배송지명을 입력해주세요"
                  onChange={(e) => {
                    mypageAddress.setNewAddress(e, 'shippingName');
                  }}
                  value={mypageAddress.newAddress.shippingName || ''}
                />
              </div>
            </div>
            <div className={css.section}>
              <div className={css.value}>
                <input
                  type="text"
                  placeholder="우편번호"
                  readOnly
                  onClick={() => {
                    mypageAddress.searchZipcode('new');
                  }}
                  value={mypageAddress.newAddress.zip || ''}
                />
              </div>
              <div
                className={css.zipcode}
                onClick={() => {
                  mypageAddress.searchZipcode('new');
                }}
              >
                우편번호찾기
              </div>
            </div>
            <div className={css.section}>
              <div className={css.value}>
                <input
                  type="text"
                  placeholder="주소"
                  readOnly
                  onClick={() => {
                    mypageAddress.searchZipcode('new');
                  }}
                  value={
                    mypageAddress.addressType === 'R'
                      ? mypageAddress.newAddress.roadAddress || ''
                      : mypageAddress.newAddress.address || ''
                  }
                />
              </div>
            </div>
            <div className={css.section}>
              <div className={css.value}>
                <input
                  type="text"
                  placeholder="상세주소를 입력해주세요"
                  onChange={(e) => {
                    mypageAddress.setNewAddress(e, 'detailAddress');
                  }}
                  value={mypageAddress.newAddress.detailAddress || ''}
                />
              </div>
            </div>
            <div className={css.section}>
              <div className={css.value}>
                <input
                  type="text"
                  placeholder="수령인을 입력해주세요."
                  onChange={(e) => {
                    mypageAddress.setNewAddress(e, 'recipientName');
                  }}
                  value={mypageAddress.newAddress.recipientName || ''}
                />
              </div>
            </div>

            <div className={css.section}>
              <div className={css.value}>
                <input
                  type="text"
                  placeholder="연락처를 입력해주세요."
                  onChange={(e) => {
                    mypageAddress.setNewAddress(e, 'recipientMobile');
                  }}
                  maxLength="13"
                  value={
                    addHyphenToMobile(
                      mypageAddress.newAddress.recipientMobile
                    ) || ''
                  }
                />
              </div>
            </div>

            <div className={css.section}>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    mypageAddress.setNewAddress(e, 'defaultCheck');
                  }}
                  checked={mypageAddress.defaultAddress}
                />
                <div className={css.checkBox} />
                <div className={css.labelTxt}>기본배송지 설정</div>
              </label>
            </div>
          </div>
        </div>

        <div
          className={css.modal__bottom}
          onClick={() => {
            mypageAddress.saveNewAddress();
          }}
        >
          등록
        </div>
      </div>
    );
  }

  /**
   * 주문 배송지 수정. 주문 배송지는 배송지 목록과 별개의 데이터
   * 사용자 배송지와 데이터 구조가 다름 (필드명이 다르다)
   */
  renderEditOrderAdress() {
    const { mypageAddress } = this.props;
    const { orderAddress } = mypageAddress;

    return (
      <div className={css.modal}>
        <div className={css.modal__top}>
          <div className={css.modal__title}>주문 배송지 변경</div>
          <div
            className={css.modal__close}
            onClick={() => {
              mypageAddress.closeOrderAddressModal();
            }}
          />
        </div>
        <div className={css.modal__body}>
          <div className={css.modal__body__title}>
            저장하신 배송지는 <span>배송지 관리</span>에서 수정 및 삭제가
            가능합니다.
          </div>
          <div className={css.modal__body__content}>
            {/* 지번 주소  */}
            {orderAddress.addressBasic && (
              <div className={css.section}>
                <div className={css.value}>
                  <input
                    type="text"
                    placeholder="주소를 입력해주세요"
                    id="mypage__newAddress"
                    readOnly
                    value={orderAddress.addressBasic || ''}
                  />
                </div>
              </div>
            )}

            {/* 도로명 주소 */}
            {orderAddress.roadAddress && (
              <div className={css.section}>
                <div className={css.value}>
                  <input
                    type="text"
                    placeholder="주소"
                    readOnly
                    onClick={() => {
                      mypageAddress.searchZipcode('shipping');
                    }}
                    value={orderAddress.roadAddress}
                  />
                </div>
              </div>
            )}

            <div className={css.section}>
              <div className={css.value}>
                <input
                  type="text"
                  placeholder="우편번호"
                  readOnly
                  onClick={() => {
                    mypageAddress.searchZipcode('shipping');
                  }}
                  value={orderAddress.zipcode || ''}
                />
              </div>
              <div
                className={css.zipcode}
                onClick={() => {
                  mypageAddress.searchZipcode('shipping');
                }}
              >
                우편번호찾기
              </div>
            </div>

            <div className={css.section}>
              <div className={css.value}>
                <input
                  type="text"
                  placeholder="상세주소를 입력해주세요"
                  onChange={(e) => {
                    mypageAddress.setOrderAddress(
                      e.target.value,
                      'addressDetail'
                    );
                  }}
                  value={orderAddress.addressDetail || ''}
                />
              </div>
            </div>
            <div className={css.section}>
              <div className={css.value}>
                <input
                  type="text"
                  placeholder="수령인을 입력해주세요."
                  onChange={(e) => {
                    mypageAddress.setOrderAddress(
                      e.target.value,
                      'receiverName'
                    );
                  }}
                  value={orderAddress.receiverName || ''}
                />
              </div>
            </div>

            <div className={css.section}>
              <div className={css.value}>
                <input
                  type="text"
                  placeholder="연락처를 입력해주세요."
                  onChange={(e) => {
                    mypageAddress.setOrderAddress(e.target.value, 'phone');
                  }}
                  maxLength="13"
                  value={orderAddress.phone || ''}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={css.modal__bottom}
          onClick={() => {
            mypageAddress.updateOrderAddress();
          }}
        >
          수정
        </div>
      </div>
    );
  }

  render() {
    let { mypageAddress } = this.props;

    return (
      <SlideIn
        direction={slideDirection.RIGHT}
        isVisible={mypageAddress.isModalOpen}
      >
        <div className={css.wrap}>
          {mypageAddress.isOrderAddressModalOpen
            ? this.renderEditOrderAdress() // 배송지 수정
            : mypageAddress.isNewAdressModal
            ? this.renderCreateModal()
            : this.renderEditModal()}
        </div>
      </SlideIn>
    );
  }
}

export default MypageAddressModal;
