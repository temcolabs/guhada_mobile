import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import Cookies from 'js-cookie';
import key from 'lib/constant/key';
import isServer, { isBrowser } from 'lib/common/isServer';
import HeadForSEO from 'lib/components/HeadForSEO';
import widerplanetTracker from 'lib/tracking/widerplanet/widerplanetTracker';
import mobonTracker from 'lib/tracking/mobon/mobonTracker';
import momentTracker from 'lib/tracking/kakaomoment/momentTracker';
import gtagTracker from 'lib/tracking/google/gtagTracker';
import { getLayoutInfo } from 'stores/LayoutStore';
import ShoppingCart from 'template/shoppingcart/ShoppingCart';
import MountLoading from 'components/atoms/Misc/MountLoading';

function ShoppingCartPage() {
  /**
   * states
   */
  const { shoppingcart: shoppingCartStore, user: userStore } = useStores();

  /**
   * handlers
   */
  const executeTracker = ({ userInfo, cartData }) => {
    widerplanetTracker.cart({
      userId: userInfo?.id,
      items: cartData.cartItemResponseList?.map((cartItem) => ({
        i: cartItem.dealId,
        t: cartItem.dealName,
      })),
    });

    mobonTracker.shoppingCart(cartData);
  };
  const getCartData = async () => {
    try {
      const cartData = await shoppingCartStore.getUserShoppingCartList();

      if (isBrowser && Cookies.get(key.ACCESS_TOKEN)) {
        userStore.pushJobForUserInfo((userInfo) => {
          executeTracker({ userInfo, cartData });
        });
        momentTracker.shoppingCart();
        gtagTracker.shoppingCart();
      }
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * side effects
   */
  useEffect(() => {
    getCartData();
  }, []);

  /**
   * render
   */
  return (
    <>
      <HeadForSEO pageName="장바구니" />
      {shoppingCartStore.status.pageStatus ? (
        <ShoppingCart />
      ) : (
        <MountLoading />
      )}
    </>
  );
}

ShoppingCartPage.getInitialProps = function({ pathname, query }) {
  const initialProps = { layout: { title: '장바구니' } };

  if (isServer) {
    const { type, headerFlags } = getLayoutInfo({ pathname, query });

    initialProps.initialState = {
      layout: { type, headerFlags },
    };
  }

  return initialProps;
};

export default observer(ShoppingCartPage);
