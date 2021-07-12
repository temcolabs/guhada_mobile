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
        {orderpayment.easyPaymentList.map((data) => (
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
                <span
                  className={css.payIcon}
                  style={{
                    width: `${orderpayment.easyPaymentMap[data].width}`,
                    backgroundImage: `url(${
                      orderpayment.easyPaymentMap[data].iconUrl
                    })`,
                  }}
                />
                <div className={css.radioTxt}>
                  {orderpayment.easyPaymentMap[data].label}
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default EasyPayment;
