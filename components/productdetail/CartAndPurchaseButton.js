import React, { Component } from 'react';
import css from './CartAndPurchaseButton.module.scss';
import { inject, observer } from 'mobx-react';
import { sendBackToLogin } from 'childs/lib/router';
import gtagTracker from 'childs/lib/tracking/google/gtagTracker';

@inject('productdetail', 'cartAndPurchase', 'login')
@observer
class CartAndPurchaseButton extends Component {
  render() {
    let {
      productdetail,
      cartAndPurchase,
      handleInternationalPopup,
      isInternationalSubmit,
      login,
    } = this.props;
    let deals = productdetail.deals;
    return (
      <div className={css.wrap}>
        {deals.purchasable ? (
          <div className={css.btnGroup}>
            <div
              className={css.shoppingCart__btn}
              onClick={() => {
                gtagTracker.gaEvent.addShoppingCart();
                if (login.isLoggedIn) {
                  if (!deals.internationalShipping) {
                    cartAndPurchase.addShoppingCart();
                  } else {
                    handleInternationalPopup(true);
                    isInternationalSubmit('addShoppingCart');
                  }
                } else {
                  sendBackToLogin();
                }
              }}
            >
              장바구니
            </div>
            <div
              className={css.buy__btn}
              onClick={() => {
                if (login.isLoggedIn) {
                  if (!deals.internationalShipping) {
                    cartAndPurchase.immediatePurchase();
                  } else {
                    handleInternationalPopup(true);
                    isInternationalSubmit('immediatePurchase');
                  }
                } else {
                  sendBackToLogin();
                }
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
            <div className={css.soldout}>{deals.reasonOfUnpurchasable}</div>
          </div>
        )}
      </div>
    );
  }
}

export default CartAndPurchaseButton;
