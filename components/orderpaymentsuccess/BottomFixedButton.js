import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './BottomFixedButton.module.scss';
import { LinkRoute } from 'childs/lib/router';
@inject('orderpaymentsuccess', 'user')
@observer
class BottomFixedButton extends Component {
  render() {
    let { orderpaymentsuccess } = this.props;
    return (
      <div className={css.wrap}>
        <LinkRoute href={`/shoppingcart`}>
          <div className={css.goShoppingCart}>장바구니</div>
        </LinkRoute>
        <LinkRoute href={`/`}>
          <div className={css.goShopping}>쇼핑 계속하기</div>
        </LinkRoute>
      </div>
    );
  }
}

export default BottomFixedButton;
