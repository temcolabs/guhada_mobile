import React, { Component } from 'react';
import Select from 'react-select';

class DealOptions extends Component {
  render() {
    let selectStyles = {
      container: () => ({
        position: 'relative',
        width: '100%',
        border: 'none',
      }),
      valueContainer: () => ({
        padding: '0',
      }),
      control: provided => ({
        ...provided,
        height: 50,
        borderRadius: 'none',
        border: 'none',
        boxShadow: 0,
        padding: '0 20px',
      }),
      placeholder: provided => ({
        ...provided,
        color: '#ccc',
        fontSize: 15,
        fontWeight: 500,
      }),
      option: (provided, state) => ({
        ...provided,
        height: 50,

        backgroundColor: state.isFocused ? '#f7f7f8' : '#fff',
        backgroundColor: state.isDisabled ? '#fff' : null,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 15,
        fontSize: 15,
        color: state.isSelected ? '#111' : '#111',
        color: state.isFocused ? '#111' : '#111',
        color: state.isDisabled ? '#ddd' : '#111',
      }),
      menu: (provided, state) => ({
        ...provided,
        margin: '1px 0 0 0',
        borderRadius: 'none',
        border: 'none',
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

    return <Select styles={selectStyles} placeholder={'구매한 상품 선택'} />;
  }
}

export default DealOptions;
