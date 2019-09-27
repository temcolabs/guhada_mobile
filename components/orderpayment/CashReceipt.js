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
        {this.state.cashReceiptRequest ? (
          <div className={css.inputWrap}>
            <div className={css.inputSection}>
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

            {this.state.PERSONAL ? (
              <div className={css.cashReceiptInput}>
                <div className={css.selectType}>
                  {/* <SelectReceiptType
              personalHandler={value => this.personalHandler(value)}
            /> */}
                  <input value="휴대폰번호" readOnly />
                </div>
                <div className={css.inputValue}>
                  <div>
                    <SelectReceiptPhone
                      receiphoneHandler={value => this.receiphoneHandler(value)}
                    />
                  </div>
                  <div>-</div>
                  <div>
                    <input
                      type="text"
                      onChange={event => {
                        orderpayment.receiptPhone(event, 'middle');
                      }}
                      value={orderpayment.cashReceiptPhone.middle || ''}
                      maxLength="4"
                    />
                  </div>
                  <div>-</div>
                  <div>
                    <input
                      type="text"
                      maxLength="4"
                      onChange={event => {
                        orderpayment.receiptPhone(event, 'last');
                      }}
                      value={orderpayment.cashReceiptPhone.last || ''}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <div className={css.inputSection}>
              <div className={css.statusWrap}>
                <label>
                  <input
                    type="radio"
                    name="receiptType"
                    value="BUSINESS"
                    onChange={e => {
                      this.receiptTypeHandler(e.target.value);
                    }}
                  />
                  <div>사업자증빙용 (세금계산서용)</div>
                </label>
              </div>
            </div>

            {!this.state.PERSONAL ? (
              <div className={css.cashReceiptInput}>
                <div className={css.selectType}>
                  {/* <SelectReceiptType
              personalHandler={value => this.personalHandler(value)}
            /> */}
                  <input
                    className={css.business}
                    value="사업자등록번호"
                    readOnly
                  />
                </div>
                <div className={css.inputValue}>
                  <div>
                    <input
                      type="text"
                      onChange={event => {
                        orderpayment.receiptEntrepreneur(event, 'first');
                      }}
                      value={orderpayment.cashReceiptEntrepreneur.first || ''}
                      maxLength="3"
                    />
                  </div>
                  <div>-</div>
                  <div>
                    <input
                      type="text"
                      onChange={event => {
                        orderpayment.receiptEntrepreneur(event, 'middle');
                      }}
                      value={orderpayment.cashReceiptEntrepreneur.middle || ''}
                      maxLength="2"
                    />
                  </div>
                  <div>-</div>
                  <div>
                    <input
                      type="text"
                      onChange={event => {
                        orderpayment.receiptEntrepreneur(event, 'last');
                      }}
                      value={orderpayment.cashReceiptEntrepreneur.last || ''}
                      maxLength="5"
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
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

class SelectReceiptPhone extends Component {
  render() {
    let selectStyles = {
      container: () => ({
        position: 'absolute',
        width: '100%',
        left: 0,
      }),
      valueContainer: () => ({
        paddingLeft: 10,
      }),
      control: provided => ({
        ...provided,
        height: 45,
        border: '1px solid #eee',
        borderRadius: 'none',
        boxShadow: 0,
        paddingLeft: 0,
      }),
      placeholder: provided => ({
        ...provided,
        color: '#777',
        fontSize: 12,
      }),
      option: (provided, state) => ({
        ...provided,
        height: 45,
        backgroundColor: state.isFocused ? '#f7f7f8' : '#fff',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 10,
        fontSize: 12,

        color: state.isDisabled ? '#ddd' : '#111',
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
            value: '010',
            label: '010',
          },
          {
            value: '011',
            label: '011',
          },
        ]}
        defaultValue={{
          value: '010',
          label: '010',
        }}
        onChange={value => {
          this.props.receiphoneHandler(value);
        }}
        isSearchable={false}
      />
    );
  }
}
