import React from 'react';
import ShoppingCart from '../../template/shoppingcart/ShoppingCart';
import { inject, observer } from 'mobx-react';
import Loading from '../../components/common/loading/Loading';
import widerplanetTracker from 'childs/lib/tracking/widerplanet/widerplanetTracker';
import Cookies from 'js-cookie';
import key from 'childs/lib/constant/key';
import { isBrowser } from 'childs/lib/common/isServer';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import momentTracker from 'childs/lib/tracking/kakaomoment/momentTracker';

@inject('shoppingcart', 'user')
@observer
class shoppingcart extends React.Component {
  componentDidMount() {
    this.getCartData();
  }

  getCartData = async () => {
    try {
      const cartData = await this.props.shoppingcart.getUserShoppingCartList();

      if (isBrowser && Cookies.get(key.ACCESS_TOKEN)) {
        this.props.user.pushJobForUserInfo(userInfo => {
          this.executeTracker({ userInfo, cartData });
        });
        momentTracker.shoppingCart();
      }
    } catch (e) {
      console.error(e);
    }
  };

  executeTracker = ({ userInfo, cartData }) => {
    widerplanetTracker.cart({
      userId: userInfo?.id,
      items: cartData.cartItemResponseList?.map(cartItem => ({
        i: cartItem.dealId,
        t: cartItem.dealName,
      })),
    });
  };

  render() {
    let { shoppingcart } = this.props;
    return (
      <>
        <HeadForSEO pageName="장바구니" />

        <div>
          {shoppingcart.status.pageStatus ? <ShoppingCart /> : <Loading />}
        </div>
      </>
    );
  }
}

export default shoppingcart;
