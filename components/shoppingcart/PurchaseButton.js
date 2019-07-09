import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './PurchaseButton.module.scss';

@inject('shoppingcart')
@observer
class PurchaseButton extends Component {
  render() {
    let { shoppingcart } = this.props;
    return (
      <div className={css.wrap}>
        <span>총</span>
        <span>{`${shoppingcart.totalAmount.totalPaymentPrice.toLocaleString()}원`}</span>
        <span>주문하기</span>
      </div>
    );
  }
}

export default PurchaseButton;
