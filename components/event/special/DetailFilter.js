import { Component } from 'react';
import Select from 'react-select';
import { SPECIAL_DETAIL_ORDER } from 'lib/constant/event/FilterOption';
import { inject, observer } from 'mobx-react';
import Router from 'next/router';

@inject('special')
@observer
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
      control: (provided) => ({
        ...provided,
        minHeight: 30,
        border: 'none',
        boxShadow: 0,
        color: '#333',
        fontSize: 13,
        fontWeight: 500,
      }),
      placeholder: (provided) => ({
        ...provided,
        color: '#333',
        fontSize: 13,
        fontWeight: '500',
      }),
      option: (provided, state) => ({
        ...provided,
        minHeight: 30,
        backgroundColor: state.isFocused ? '#f7f7f8' : '#fff',
        paddingLeft: 14,
        fontSize: 12,
        color: state.isSelected ? '#111' : '#111',
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

    const { query } = Router.router;
    const { special } = this.props;

    return (
      <Select
        styles={selectStyles}
        placeholder={`신상품순`}
        options={SPECIAL_DETAIL_ORDER}
        onChange={(value) => {
          special.getSpecialDetail({
            id: query.id,
            page: 1,
            order: value.value,
          });
        }}
        isSearchable={false}
      />
    );
  }
}

export default Filter;
