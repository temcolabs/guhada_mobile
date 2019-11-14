import React, { Component } from 'react';
import Select from 'react-select';

class Filter extends Component {
  render() {
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
        minHeight: 30,
        border: 'none',
        boxShadow: 0,
        color: '#333',
        fontSize: 13,
        fontWeight: 500,
      }),
      placeholder: provided => ({
        ...provided,
        color: '#333',
        fontSize: 13,
        fontWeight: '500',
      }),
      option: (provided, state) => ({
        ...provided,
        minHeight: 30,
        backgroundColor: state.isFocused ? '#f7f7f8' : '#fff',
        backgroundColor: state.isDisabled ? '#fff' : null,
        paddingLeft: 14,
        fontSize: 12,
        color: state.isSelected ? '#111' : '#111',
        color: state.isFocused ? '#111' : '#111',
        color: state.isDisabled ? '#ddd' : '#111',
      }),
      menu: (provided, state) => ({
        ...provided,
      }),
      dropdownIndicator: (provided, state) => ({
        ...provided,
        transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : '',
        padding: 0,
        color: '#111',
        fontSize: '12px',
      }),
      indicatorsContainer: () => ({
        padding: 0,
      }),
    };

    return (
      <Select
        styles={selectStyles}
        placeholder={`진행중 이벤트`}
        options={[
          {
            label: '진행중 이벤트',
            value: 'valid',
          },
        ]}
        // onChange={value => {
        //   mypageLike.selectOption(value);
        // }}
        isSearchable={false}
      />
    );
  }
}

export default Filter;
