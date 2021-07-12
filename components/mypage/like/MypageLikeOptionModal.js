import React, { Component, Fragment } from 'react';
import css from './MypageLikeOptionModal.module.scss';
import MypageLikeOptionSelect from './MypageLikeOptionSelect';
import { inject, observer } from 'mobx-react';

@inject('mypageLike')
@observer
class MypageLikeOptionModal extends Component {
  render() {
    let { mypageLike } = this.props;
    let data = mypageLike.likeOptionModalItem;
    return (
      <div className={css.modal__wrap}>
        <div className={css.modal}>
          <div className={css.modal__top}>
            <div className={css.modal__title}>
              {mypageLike.optionModalPurchase ? '구매하기' : '장바구니 담기'}
            </div>
            <div
              className={css.modal__close}
              onClick={() => {
                mypageLike.optionModalClose();
              }}
            >
              <img src="/public/icon/modal_close.png" alt="모달창 닫기" />
            </div>
          </div>

          <div className={css.modal__body}>
            <div className={css.product}>
              <div
                className={css.product__image}
                style={{
                  backgroundImage: `url(${data.imageUrl})`,
                }}
              />
              <div className={css.product__info}>
                <div className={css.product__brand}>{data.brandName}</div>
                <div className={css.product__name}>{`${
                  data.productSeason ? data.productSeason : ''
                } ${data.productName}`}</div>
                <div className={css.product__price}>
                  <div className={css.product__discountPrice}>
                    {`${
                      data?.discountPrice
                        ? data?.discountPrice?.toLocaleString()
                        : null
                    }원`}
                  </div>
                  <div className={css.product__sellPrice}>
                    {`${
                      data?.sellPrice ? data?.sellPrice?.toLocaleString() : null
                    }원`}
                  </div>
                  <div
                    className={css.product__discountRate}
                  >{`${data.discountRate}%`}</div>
                </div>
              </div>
            </div>
            <div className={css.shipping}>
              <div className={css.shipping__title}>배송 정보</div>
              <div className={css.ship__expense}>
                {data.shipExpenseType === 'FREE' ? '무료 배송' : '유료배송'}
              </div>
            </div>
            {mypageLike.likeItemRealOptions.length ? (
              <div className={css.option}>
                <div className={css.option__title}>옵션 선택</div>
                <div className={css.option__select}>
                  <MypageLikeOptionSelect />
                </div>
              </div>
            ) : null}

            <div className={css.quantity__change}>
              <div className={css.quantity__title}>주문 수량</div>
              <div className={css.quantity__select}>
                <div
                  className={css.minus__btn}
                  onClick={() => {
                    mypageLike.quantityMinus();
                  }}
                  onMouseOver={() => {
                    mypageLike.quantityMinusHoverOn();
                  }}
                  onMouseOut={() => {
                    mypageLike.quantityMinusHoverOut();
                  }}
                  style={{
                    backgroundImage: `url(${mypageLike.quantityMinusBtn})`,
                  }}
                />
                <div className={css.quantity}>
                  <input
                    type="text"
                    value={mypageLike.selectedQuantity}
                    onChange={(e) => {
                      mypageLike.quantityChange(e);
                    }}
                    onBlur={(e) => {
                      mypageLike.quantityChangeOutFocus(e);
                    }}
                  />
                </div>
                <div
                  className={css.plus__btn}
                  onClick={() => {
                    mypageLike.quantityPlus();
                  }}
                  onMouseOver={() => {
                    mypageLike.quantityPlusHoverOn();
                  }}
                  onMouseOut={() => {
                    mypageLike.quantityPlusHoverOut();
                  }}
                  style={{
                    backgroundImage: `url(${mypageLike.quantityPlusBtn})`,
                  }}
                />
              </div>
              <div className={css.quantity__stock}>
                {mypageLike.selectedOption
                  ? mypageLike.selectedOption.stock <= 10
                    ? `${mypageLike.selectedOption.stock} 개 남음`
                    : null
                  : null}
              </div>
            </div>
          </div>

          <div className={css.total__price}>
            <div className={css.total__price__title}>총 상품금액</div>

            <div className={css.total__price__amount}>
              {mypageLike.selectedOptionPrice ? (
                <span className={css.total__option__price}>
                  {mypageLike.selectedOptionPrice > 0
                    ? `+ ${mypageLike.selectedOptionPrice.toLocaleString()}원`
                    : `- ${mypageLike.selectedOptionPrice.toLocaleString()}원`}
                </span>
              ) : null}

              {mypageLike.selectedTotalPrice}
              <span>원</span>
            </div>
          </div>
          <div className={css.btnGroup}>
            <div
              onClick={() => {
                mypageLike.optionModalClose();
              }}
            >
              취소
            </div>
            <div
              onClick={() => {
                mypageLike.optionDataActive();
              }}
            >
              {mypageLike.optionModalPurchase ? '구매하기' : '담기'}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MypageLikeOptionModal;
