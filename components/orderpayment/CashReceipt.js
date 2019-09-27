import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './CashReceipt.module.scss';
import Select from 'react-select';

@inject('orderpayment')
@observer
class CashReceipt extends Component {
  state = {
    cashReceiptRequest: false,
    PERSONAL: true,
    typePhone: true,
  };

  receiptHandler = value => {
    if (value === 'request') {
      this.setState({
        cashReceiptRequest: true,
      });
      this.props.orderpayment.setCashReceiptHandler(true);
    } else {
      this.setState({
        cashReceiptRequest: false,
      });
      this.props.orderpayment.setCashReceiptHandler(false);
    }
  };

  receiptTypeHandler = value => {
    this.setState({
      typePhone: true,
    });
    value === 'PERSONAL'
      ? this.setState({
          PERSONAL: true,
        })
      : this.setState({
          PERSONAL: false,
        });
    this.props.orderpayment.setCashReceiptUsage(value);
  };

  personalHandler = value => {
    value.value === 'phone'
      ? this.setState({
          typePhone: true,
        })
      : this.setState({
          typePhone: false,
        });
  };

  receiphoneHandler = value => {
    console.log(value, 'value');
    this.props.orderpayment.receiptPhone(value, 'first');
  };
  render() {
    let { orderpayment } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.section}>
          <div className={css.title}>현금영수증</div>
          <div className={css.statusWrap}>
            <label>
              <input
                type="radio"
                name="receiptStatus"
                value="request"
                onChange={e => {
                  this.receiptHandler(e.target.value);
                }}
              />
              <div>신청</div>
            </label>
            <label>
              <input
                type="radio"
                name="receiptStatus"
                defaultChecked
                onChange={() => {
                  this.receiptHandler();
                }}
              />
              <div>미신청</div>
            </label>
          </div>
        </div>

        <div className={css.personalSection}>
          <div className={css.statusWrap}>
            <label>
              <input
                type="radio"
                name="receiptType"
                value="PERSONAL"
                defaultChecked
                onChange={e => {
                  this.receiptTypeHandler(e.target.value);
                }}
              />
              <div>개인소득공제용</div>
            </label>
          </div>
        </div>

        <div className={css.cashReceiptPhone}>
          <div className={css.selectType}>
            <SelectReceiptType
              personalHandler={value => this.personalHandler(value)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default CashReceipt;

class SelectReceiptType extends Component {
  render() {
    let selectStyles = {
      container: () => ({
        position: 'absolute',
        width: '100%',
        left: 0,
        color: '#777',
      }),
      valueContainer: () => ({
        paddingLeft: 10,
        color: '#777',
      }),
      control: provided => ({
        ...provided,
        height: 45,
        border: '1px solid #eee',
        borderRadius: 'none',
        boxShadow: 0,
        paddingLeft: 0,
        color: '#777',
      }),
      placeholder: provided => ({
        ...provided,
        color: '#777',
        fontSize: 13,
      }),
      option: (provided, state) => ({
        ...provided,
        height: 45,
        backgroundColor: state.isFocused ? '#f7f7f8' : '#fff',
        fontSize: 13,
        color: '#777',
        fontFamily: 'NotoSansCJKkr',
      }),
      menu: (provided, state) => ({
        ...provided,
        position: 'absolute',
        left: 0,
        margin: 1,
      }),
      dropdownIndicator: (provided, state) => ({
        ...provided,
        transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : '',
        paddingRight: 10,
        color: '#777',
        fontSize: 12,
      }),
      indicatorsContainer: () => ({
        padding: 0,
      }),
    };

    return (
      <Select
        styles={selectStyles}
        options={[
          {
            value: 'phone',
            label: '휴대폰번호',
          },
          // {
          //   value: 'registerNumber',
          //   label: '주민등록번호',
          // },
        ]}
        placeholder="휴대폰번호"
        onChange={value => {
          this.props.personalHandler(value);
        }}
        isSearchable={false}
      />
    );
  }
}
