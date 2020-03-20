import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Select from 'react-select';

@inject('productdetail', 'productoption')
@observer
class ProductOptionSelectbox extends Component {
  render() {
    let { productdetail, productoption } = this.props;
    let selectStyles = {
      container: () => ({
        position: 'relative',
        width: '100%',
        border: '1px solid #eee',
        zIndex: '3',
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
        padding: '0 15px',
      }),
      placeholder: provided => ({
        ...provided,
        color: '#111',
        fontSize: 14,
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
        position: 'relative',
        maxHeight: '200px',
        overflow: 'auto',
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

    return (
      <Select
        styles={selectStyles}
        options={productoption.options.realOptions}
        formatOptionLabel={productoption.getLabelColor}
        placeholder={`${productdetail.deals.options[0]?.label1 || ''} ${
          productdetail.deals.options[0]?.label2 ? ',' : ''
        } ${productdetail.deals.options[0]?.label2 || ''} ${
          productdetail.deals.options[0]?.label3 ? ',' : ''
        }  ${productdetail.deals.options[0]?.label3 || ''}  `}
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
