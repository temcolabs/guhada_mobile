import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Select from 'react-select';

@inject('productoption')
@observer
class ProductOptionSelectbox extends Component {
  render() {
    let { productoption } = this.props;
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
        height: 60,
        border: 'none',
        borderRadius: 'none',
        boxShadow: 0,
        paddingLeft: 0,
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
        backgroundColor: state.isFocused ? '#f7f7f8' : '#fff',
        backgroundColor: state.isDisabled ? '#fff' : null,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 20,
        fontSize: 15,
        color: state.isSelected ? '#111' : '#111',
        color: state.isFocused ? '#111' : '#111',
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
      <Select
        styles={selectStyles}
        options={productoption.options.realOptions}
        formatOptionLabel={productoption.getLabelColor}
        placeholder="옵션선택"
        onChange={value => {
          productoption.selectOption(value);
        }}
        value={productoption.options.selectedOption}
        isSearchable={false}
      />
    );
  }
}

export default ProductOptionSelectbox;
