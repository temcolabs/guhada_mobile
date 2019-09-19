import React, { Component } from 'react';
import css from './CartAndPurchaseButton.module.scss';
import { inject, observer } from 'mobx-react';
@inject('productdetail', 'cartAndPurchase')
@observer
class CartAndPurchaseButton extends Component {
  render() {
    let { productdetail, cartAndPurchase } = this.props;
    let deals = productdetail.deals;
    return (
      <div className={css.wrap}>
        {deals.totalStock > 0 ? (
          <div className={css.btnGroup}>
            <div
              className={css.shoppingCart__btn}
              onClick={() => {
                cartAndPurchase.setShoppingCart();
              }}
            >
              장바구니
            </div>
            <div
              className={css.buy__btn}
              onClick={() => {
                cartAndPurchase.immediatePurchase();
              }}
            >
              바로구매
            </div>
          </div>
        ) : (
          <div className={css.btnGroup}>
            {/* <div
              className={css.reEntry__btn}
              onClick={() => {
                cartAndPurchase.reEntryNotify();
              }}
            >
              재입고알림
            </div> */}
            <div className={css.soldout}>품절</div>
          </div>
        )}
      </div>
    );
  }
}

export default CartAndPurchaseButton;
