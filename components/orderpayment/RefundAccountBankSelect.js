import React, { Component, Fragment } from 'react';
import Select from 'react-select';
import { inject, observer } from 'mobx-react';

@inject('orderpayment')
@observer
class RefundAccountBankSelect extends Component {
  render() {
    let { orderpayment, bankNameSelect } = this.props;
    let options = [
      {
        label: '우리은행',
        value: '06',
      },
      {
        label: '신한카드',
        value: '07',
      },
    ];
    let selectStyles = {
      container: () => ({
        position: 'relative',
        width: '100%',
      }),
      valueContainer: () => ({
        padding: 0,
      }),
      control: provided => ({
        ...provided,
        height: 45,
        border: 'solid 1px #eee',
        borderRadius: '0px',
        boxShadow: 0,
        padding: '0 15px 0 15px',
      }),
      placeholder: provided => ({
        ...provided,
        color: '#777',
        fontSize: 13,
        fontWeight: 'normal',
        fontFamily: 'NotoSansCJKkr',
      }),
      option: (provided, state) => ({
        ...provided,
        height: 45,
        backgroundColor: state.isFocused
          ? '#f7f7f8'
          : state.isDisabled
          ? '#fff'
          : null,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 20,
        fontSize: 13,
        color: state.isSelected
          ? '#111'
          : state.isFocused
          ? '#111'
          : state.isDisabled
          ? '#ddd'
          : '#111',
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
        color: '#777',
      }),
      indicatorsContainer: () => ({
        padding: 0,
      }),
    };

    return (
      <Select
        styles={selectStyles}
        placeholder="은행명을 선택해주세요."
        options={options}
        onChange={value => {
          bankNameSelect(value.label);
        }}
        isSearchable={false}
      />
    );
  }
}

export default RefundAccountBankSelect;
