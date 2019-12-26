import React, { Component } from 'react';
import Select from 'react-select';
import { inject, observer } from 'mobx-react';

@inject('mypageLike')
@observer
class MypageLikeOptionSelect extends Component {
  render() {
    let { mypageLike } = this.props;
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
        height: 50,
        border: 'solid 1px #dfe3e9',
        borderRadius: '4px',
        boxShadow: 0,
        padding: '0 15px 0 15px',
      }),
      placeholder: provided => ({
        ...provided,
        color: '#354052',
        fontSize: 13,
        fontWeight: 'normal',
      }),
      option: (provided, state) => ({
        ...provided,
        height: 36,
        backgroundColor: state.isFocused ? '#f7f7f8' : '#fff',
        backgroundColor: state.isDisabled ? '#fff' : null,
        paddingLeft: 20,
        fontSize: 13,
        color: state.isSelected ? '#111' : '#111',
        color: state.isFocused ? '#111' : '#111',
        color: state.isDisabled ? '#ddd' : '#111',
      }),
      menu: (provided, state) => ({
        ...provided,
        margin: 1,
      }),
      dropdownIndicator: (provided, state) => ({
        ...provided,
        transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : '',
        padding: 0,
        color: '#999',
      }),
      indicatorsContainer: () => ({
        padding: 0,
      }),
    };

    return (
      <Select
        styles={selectStyles}
        placeholder={`${mypageLike.likeItemTempOptions[0].label1 ||
          ''} ${mypageLike.likeItemTempOptions[0].label2 || ''} ${mypageLike
          .likeItemTempOptions[0].label3 || ''}  `}
        options={mypageLike.likeItemRealOptions}
        formatOptionLabel={mypageLike.getLabelColor}
        onChange={value => {
          mypageLike.selectOption(value);
        }}
        value={mypageLike.selectedOption}
        isSearchable={false}
      />
    );
  }
}

export default MypageLikeOptionSelect;
