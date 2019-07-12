import React, { Component, Fragment } from 'react';
import Select from 'react-select';
import { inject, observer } from 'mobx-react';

@inject('orderpayment')
@observer
class CouponSelect extends Component {
  render() {
    let { orderpayment } = this.props;

    let selectStyles = {
      container: () => ({
        position: 'relative',
        width: '100%',
        borderRadius: 'none',
      }),
      valueContainer: () => ({
        padding: 0,
      }),
      control: provided => ({
        ...provided,
        height: 45,
        border: 'solid 1px #dfe3e9',
        borderRadius: 'none',
        boxShadow: 0,
        padding: '0 15px 0 15px',
      }),
      placeholder: provided => ({
        ...provided,
        color: '#354052',
        fontSize: 13,
        fontWeight: 'normal',
        fontFamily: 'NotoSansCJKkr',
      }),
      option: (provided, state) => ({
        ...provided,
        height: 36,
        backgroundColor: state.isFocused
          ? '#f7f7f8'
          : state.isDisabled
          ? '#fff'
          : null,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 20,
        fontSize: 13,
        color: state.isDisabled ? '#ddd' : '#111',
        fontFamily: 'NotoSansCJKkr',
        borderRadius: 'none',
      }),
      menu: (provided, state) => ({
        ...provided,
        margin: 1,
        borderRadius: 'none',
      }),
      dropdownIndicator: (provided, state) => ({
        ...provided,
        transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : '',
        padding: 0,
        color: '#9197ab',
      }),
      indicatorsContainer: () => ({
        padding: 0,
      }),
    };

    return (
      <Fragment>
        <Select
          styles={selectStyles}
          placeholder="쿠폰을 선택해주세요"
          options={[1, 2, 3]}
          isSearchable={false}
        />
      </Fragment>
    );
  }
}

export default CouponSelect;
