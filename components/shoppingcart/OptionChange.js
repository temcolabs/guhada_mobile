import React, { Component } from 'react';
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
        borderBottom: '1px solid #ddd',
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
        paddingLeft: 0,
        backgroundColor: '#fafafa',
      }),
      placeholder: provided => ({
        ...provided,
        color: '#111',
        fontSize: 14,
        fontWeight: 500,
        fontFamily: 'NotoSansCJKkr',
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
        fontFamily: 'NotoSansCJKkr',
      }),
      menu: (provided, state) => ({
        ...provided,
        margin: 1,
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
              <div
                className={css.stock}
              >{`${shoppingcart.selectedOptions.stock}개 남음`}</div>
            )
          ) : null}
        </div>

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
