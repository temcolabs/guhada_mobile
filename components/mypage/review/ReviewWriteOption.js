import React, { Component } from 'react';
import Select from 'react-select';

export class ReviewWriteOption extends Component {
  selectStyles = {
    container: () => ({
      position: 'relative',
      width: '100%',
      marginTop: 20,
    }),
    valueContainer: () => ({
      padding: 0,
    }),
    control: provided => ({
      ...provided,
      height: 36,
      border: 'solid 1px #eeeeee',
      borderRadius: '4',
      boxShadow: 0,
      paddingLeft: 15,
    }),
    placeholder: provided => ({
      ...provided,
      color: '#444444',
      fontSize: 13,
      fontWeight: 'normal',
      fontFamily: 'NotoSansCJKkr',
    }),
    option: (provided, state) => ({
      ...provided,
      height: 50,
      backgroundColor: state.isFocused
        ? '#f7f7f8'
        : state.isDisabled
        ? '#fff'
        : '#fff',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 20,
      fontSize: 15,
      color: state.isDisabled
        ? '#ddd'
        : state.isSelected
        ? '#111'
        : state.isFocused
        ? '#111'
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
      paddingRight: 12,
      color: '#111',
    }),
    indicatorsContainer: () => ({
      padding: 0,
    }),
  };
  render() {
    return <Select styles={this.selectStyles} placeholder="리뷰직접입력" />;
  }
}

export default ReviewWriteOption;
