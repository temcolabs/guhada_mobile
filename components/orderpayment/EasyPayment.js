import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './EasyPayment.module.scss';

@inject('orderpayment')
@observer
class EasyPayment extends Component {
  constructor(props) {
    super(props);
    this.state = { paymentType: '' };
  }

  render() {
    let { orderpayment } = this.props;
    return (
      <div className={css.wrap}>
        {orderpayment.easyPaymentList.map((data) => {
          const paymentIconStyle = {
            marginLeft: '15px',
            marginTop: '3px',
            width: `${orderpayment.easyPaymentMap[data].width}`,
            height: '20px',
            color: 'white',
            background: `url(${orderpayment.easyPaymentMap[data].iconUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          };

          return (
            <div className={css.section} key={data}>
              <div className={css.statusWrap}>
                <label>
                  <input
                    type="radio"
                    name="receiptStatus"
                    value={data}
                    onChange={(e) => {
                      orderpayment.setPaymentMethod(data);
                    }}
                  />
                  <div className={css.radioBtn} />
                  <span style={paymentIconStyle} />
                  <div className={css.radioTxt}>
                    {orderpayment.easyPaymentMap[data].label}
                  </div>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default EasyPayment;
