import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import css from './OptionChange.module.scss';
import Select from 'react-select';
@inject('shoppingcart')
@observer
class OptionChange extends Component {
  render() {
    let { shoppingcart, data } = this.props;
    let selectStyles = {
      container: () => ({
        position: 'relative',
        width: '100%',
        border: '1px solid #eee',
        backgroundColor: '#fff',
        margin: '0 0 20px 0',
      }),
      valueContainer: () => ({
        padding: 0,
      }),
      control: provided => ({
        ...provided,
        height: 40,
        border: 'none',
        borderRadius: 'none',
        boxShadow: 0,
        padding: '0 15px',
        backgroundColor: '#fff',
      }),
      placeholder: provided => ({
        ...provided,
        color: '#111',
        fontSize: 14,
        fontWeight: 500,
      }),
      option: (provided, state) => ({
        ...provided,
        height: 50,
        backgroundColor: state.isDisabled ? '#fff' : null,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 20,
        fontSize: 15,
        color: state.isDisabled ? '#ddd' : '#111',
      }),
      menu: (provided, state) => ({
        ...provided,
        margin: '1px 0 0 0',
        borderRadius: 'none',
      }),
      dropdownIndicator: (provided, state) => ({
        ...provided,
        transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : '',
        padding: 0,
        color: '#111',
      }),
      indicatorsContainer: () => ({
        padding: 0,
      }),
    };
    return (
      <div className={css.wrap}>
        {!data.selectedCartOption ? (
          <div className={css.quantityChangeWrap}>
            <div className={css.quantityChange}>
              <div
                className={css.minus__btn}
                onClick={() => {
                  shoppingcart.quantityMinus(data.cartItemId);
                }}
              >
                <img src={shoppingcart.quantityMinusBtn} alt="btn" />
              </div>
              <div className={css.quantity}>
                <input
                  value={shoppingcart.cartChangeOptions.willChangeQuantity}
                  onChange={e => {
                    shoppingcart.quantityChange(data.cartItemId, e);
                  }}
                  onBlur={e => {
                    shoppingcart.quantityChangeOutFocus(data.cartItemId, e);
                  }}
                />
              </div>
              <div
                className={css.plus__btn}
                onClick={() => {
                  shoppingcart.quantityPlus(data.cartItemId);
                }}
              >
                <img src={shoppingcart.quantityPlusBtn} alt="plus button" />
              </div>
            </div>
            {data.totalStock > 10 ? null : (
              <div className={css.stock}>{`${data.totalStock}개 남음`}</div>
            )}

            {shoppingcart.status.quantityNotice ? (
              <div className={css.optionNotice}>
                최소 구매 수량은 1개입니다.
              </div>
            ) : null}
          </div>
        ) : (
          <Fragment>
            <Select
              styles={selectStyles}
              placeholder="옵션을 선택해주세요"
              options={shoppingcart.cartChangeOptions.realOptions}
              formatOptionLabel={shoppingcart.getLabelColor}
              onChange={value => {
                shoppingcart.setChangeItemData(value);
              }}
              defaultValue={
                shoppingcart.cartChangeOptions.realOptions.length
                  ? shoppingcart.cartChangeOptions.realOptions[
                      shoppingcart.selectedOptionIndex
                    ]
                  : null
              }
              isSearchable={false}
            />

            <div className={css.quantityChangeWrap}>
              <div className={css.quantityChange}>
                <div
                  className={css.minus__btn}
                  onClick={() => {
                    shoppingcart.quantityMinus(data.cartItemId);
                  }}
                >
                  <img src={shoppingcart.quantityMinusBtn} alt="btn" />
                </div>
                <div className={css.quantity}>
                  <input
                    value={shoppingcart.cartChangeOptions.willChangeQuantity}
                    onChange={e => {
                      shoppingcart.quantityChange(data.cartItemId, e);
                    }}
                    onBlur={e => {
                      shoppingcart.quantityChangeOutFocus(data.cartItemId, e);
                    }}
                  />
                </div>
                <div
                  className={css.plus__btn}
                  onClick={() => {
                    shoppingcart.quantityPlus(data.cartItemId);
                  }}
                >
                  <img src={shoppingcart.quantityPlusBtn} alt="plus button" />
                </div>
              </div>
              {shoppingcart.selectedOptions ? (
                shoppingcart.selectedOptions.stock > 10 ? null : (
                  <div className={css.stock}>{`${
                    shoppingcart.selectedOptions.stock
                  }개 남음`}</div>
                )
              ) : null}

              {shoppingcart.status.quantityNotice ? (
                <div className={css.optionNotice}>
                  최소 구매 수량은 1개입니다.
                </div>
              ) : null}
            </div>
          </Fragment>
        )}

        <div className={css.buttonGroup}>
          <div
            className={css.optionChangeCancle}
            onClick={() => {
              shoppingcart.shoppingCartModalClose();
            }}
          >
            취소
          </div>
          <div
            className={css.optionChangeConfirm}
            onClick={() => {
              shoppingcart.optionChange();
            }}
          >
            변경
          </div>
        </div>
      </div>
    );
  }
}

export default OptionChange;
