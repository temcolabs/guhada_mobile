import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import Cookies from 'js-cookie';
import key from 'childs/lib/constant/key';
import isServer, { isBrowser } from 'childs/lib/common/isServer';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import widerplanetTracker from 'childs/lib/tracking/widerplanet/widerplanetTracker';
import mobonTracker from 'childs/lib/tracking/mobon/mobonTracker';
import momentTracker from 'childs/lib/tracking/kakaomoment/momentTracker';
import gtagTracker from 'childs/lib/tracking/google/gtagTracker';
import { getLayoutInfo } from 'stores/LayoutStore';
import ShoppingCart from 'template/shoppingcart/ShoppingCart';
import Layout from 'components/layout/Layout';
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
      <Layout title="장바구니">
        {shoppingCartStore.status.pageStatus ? (
          <ShoppingCart />
        ) : (
          <MountLoading />
        )}
      </Layout>
    </>
  );
}

ShoppingCartPage.getInitialProps = function({ pathname, query }) {
  if (isServer) {
    const { type, headerFlags } = getLayoutInfo({ pathname, query });
    return {
      initialState: {
        layout: {
          type,
          headerFlags,
        },
      },
    };
  }
  return {};
};

export default observer(ShoppingCartPage);
