import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './PaymentButton.module.scss';
@inject('orderpayment')
@observer
class PaymentButton extends Component {
  render() {
    let { orderpayment } = this.props;
    return (
      <div
        className={css.wrap}
        style={{ backgroundColor: '#b7bec4' }}
        onClick={() => {
          orderpayment.payment();
        }}
      >
        결제하기
      </div>
    );
  }
}

export default PaymentButton;
