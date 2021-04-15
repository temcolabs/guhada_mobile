import React from 'react';
import ReactSelect from 'react-select'; // https://react-select.com/
import { devLog } from 'childs/lib/common/devLog';
import './Select.scss';

const customStyles = {
  control: (base, state) => ({
    ...base,
    display: 'flex',
    alignItems: 'center',
    height: 45,
    minHeight: 45,
    boxShadow: 'none',
    fontSize: 13,
    borderColor: state.isFocused ? '#eeeeee' : '#eeeeee',
    borderRadius: 0,
    '&:hover': {
      borderColor: '#eeeeee',
    },
    borderTop: 'none',
  }),
  singleValue: (base, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    return { ...base, opacity, transition };
  },
  valueContainer: (base, state) => ({
    ...base,
    padding: '0 15px',
    zIndex: 10,
    minHeight: '1.45em',
  }),
  dropdownIndicator: (provided, state) => {
    return {
      ...provided,
      color: '#a3a3a3',
      '&:hover': {
        borderColor: '#a3a3a3',
      },
    };
  },
  placeholder: (base) => ({
    ...base,
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: 'none',
  }),
  menu: (base) => ({
    ...base,
    zIndex: 30,
  }),
  option: (base, state) => ({
    ...base,
    padding: '8px 15px',
    fontSize: '13px',
    color: '#374146',
    fontWeight: state.isSelected ? 700 : 400,
    backgroundColor: '#fff',
    '&:hover': {
      backgroundColor: '#f9f9fa',
    },
  }),
};

export default class SingleSelect extends React.Component {
  static defaultProps = {
    name: 'select-name',
    options: null, // Array<{ label: string, value: any }>
    extra: null, // mobx-form 에서 사용하는 옵션 배열
    placeholder: '선택해주세요.',
    className: 'reactSelect--single',
    value: null, // 기본 선택 옵션 { label: string, value: any }
    onChange: (option) => devLog(option),
    isSearchable: false,
    isClearable: false,
    isDisabled: false,
    isLoading: false,
    isRtl: false,
  };

  render() {
    const {
      options, // Array of
      extra,
      name,
      value,
      initialValue,
      isSearchable,
      isClearable,
      isDisabled,
      isLoading,
      isRtl,
    } = this.props;

    return (
      <ReactSelect
        {...this.props}
        // defaultvalue 재설정을 위해 키를 지정
        value={value || initialValue}
        key={`my_unique_select_key__${name || +new Date()}`}
        options={options || extra || []}
        instanceId={this.props.name}
        styles={customStyles}
        classNamePrefix="mypageForm-select"
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isRtl={isRtl}
        isSearchable={isSearchable}
        noOptionsMessage={({ inputValue }) => null}
      />
    );
  }
}
