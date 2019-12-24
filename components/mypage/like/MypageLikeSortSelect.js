import React, { Component, Fragment } from 'react';
import Select from 'react-select';
import { inject, observer } from 'mobx-react';

@inject('mypageLike')
@observer
class MypageLikeSortSelect extends Component {
  render() {
    let { mypageLike } = this.props;
    let likeSortOption = [
      {
        value: 'DESC',
        label: '최신 등록순',
      },
      {
        value: 'ASC',
        label: '나중 등록순',
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
        height: 30,
        border: 'solid 1px #ddd',
        boxShadow: 0,
        padding: '0px 11px 0px 11px',
      }),
      placeholder: provided => ({
        ...provided,
        color: '#444',
        fontSize: 13,
        fontWeight: '500',
      }),
      option: (provided, state) => ({
        ...provided,
        height: 30,
        backgroundColor: state.isFocused ? '#f7f7f8' : '#fff',
        backgroundColor: state.isDisabled ? '#fff' : null,
        alignItems: 'center',
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
          options={likeSortOption}
          defaultValue={likeSortOption[0]}
          onChange={likeSortOption => {
            mypageLike.likeSortChange(likeSortOption);
          }}
          isSearchable={false}
        />
      </Fragment>
    );
  }
}

export default MypageLikeSortSelect;
