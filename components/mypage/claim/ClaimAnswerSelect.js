import React, { Component, Fragment } from 'react';
import Select from 'react-select';
import { inject, observer } from 'mobx-react';
import inquiryStatus from 'lib/constant/inquiry/inquiryStatus';

@inject('mypageInquiry')
@observer
class ClaimAnswerSelect extends Component {
  render() {
    const { mypageInquiry } = this.props;
    const inquiryOption = [
      {
        value: inquiryStatus.ALL,
        label: '전체문의',
      },
      {
        value: inquiryStatus.PENDING,
        label: '미답변',
      },
      {
        value: inquiryStatus.COMPLETED,
        label: '답변완료',
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
      control: (provided) => ({
        ...provided,
        minHeight: 30,
        border: 'solid 1px #ddd',
        boxShadow: 0,
        padding: '0px 11px 0px 11px',
        borderRadius: 'none',
        fontSize: 12,
      }),
      placeholder: (provided) => ({
        ...provided,
        color: '#aaa',
        fontWeight: 'normal',
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#f7f7f8' : '#fff',
        fontSize: 12,
        color: state.isSelected ? '#111' : '#111',
      }),
      menu: (provided, state) => ({
        ...provided,
        margin: 0,
        borderRadius: 'none',
        border: 'none',
        width: '100%',
      }),
      dropdownIndicator: (provided, state) => ({
        ...provided,
        transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : '',
        padding: 0,
        width: '16px',
        height: '20px',
        color:
          state.isSelected || state.isDisabled || state.isFocused
            ? '#aaa'
            : '#aaa',
        border: 'none',
      }),
      indicatorsContainer: () => ({
        padding: 0,
      }),
    };
    return (
      <Fragment>
        <Select
          styles={selectStyles}
          options={inquiryOption}
          defaultValue={inquiryOption[0]}
          onChange={this.props.onChange}
          isSearchable={false}
        />
      </Fragment>
    );
  }
}

export default ClaimAnswerSelect;
