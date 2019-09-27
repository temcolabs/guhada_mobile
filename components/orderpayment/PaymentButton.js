import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './PaymentButton.module.scss';
@inject('orderpayment')
@observer
class PaymentButton extends Component {
  render() {
    let { orderpayment } = this.props;

    return orderpayment.status.orderPaymentAgreement ? (
      <div
        className={css.wrap}
        style={{ backgroundColor: '#5d2ed1' }}
        onClick={() => {
          orderpayment.payment();
        }}
      >
        결제하기
      </div>
    ) : (
      <div className={css.wrap} style={{ backgroundColor: '#ddd' }}>
        결제하기
      </div>
    );
  }
}

export default PaymentButton;
