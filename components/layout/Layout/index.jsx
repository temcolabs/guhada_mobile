import css from './Layout.module.scss';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';
import { useScrollDown } from 'hooks';
import Header from './Header';
import Navigation from './Navigation';
import PluginButtons from './PluginButtons';

function Layout({ title, scrollMemo, children }) {
  /**
   * states
   */
  const {
    layout: layoutStore,
    newMain: newMainStore,
    /* TODO */
    shoppingcart: shoppingcartStore,
    user,
    category,
    mypageRecentlySeen,
  } = useStores();
  const router = useRouter();
  const isScrollDown = useScrollDown(40);

  useEffect(() => {
    layoutStore.initialize(router);
    newMainStore.initialize();

    window.addEventListener('popstate', layoutStore.popState);

    /* TODO */
    const job = () => shoppingcartStore.globalGetUserShoppingCartList();
    user.pushJobForUserInfo(job);
    mypageRecentlySeen.init();
    category.getCategory();

    if (scrollMemo) {
      layoutStore.scrollMemo = true;
    } else if (layoutStore.scrollMemo) {
      layoutStore.scrollMemo = false;
    } else {
      window.scrollTo(0, 0);
    }

    return () => {
      window.removeEventListener('popstate', layoutStore.popState);
    };
  }, [router]);

  /**
   * render
   */
  return (
    <>
      <Header
        {...layoutStore.headerFlags}
        title={
          layoutStore.headerFlags.title &&
          (title || layoutStore.headerInfo.title)
        }
        cartCount={shoppingcartStore.cartAmount}
        isScrollDown={isScrollDown}
      />
      <main className={css['main']}>{children}</main>
      <Navigation
        type={layoutStore.type}
        noNav={layoutStore.headerFlags.noNav}
      />
      <PluginButtons
        isScrollDown={isScrollDown}
        recentCount={layoutStore.recentCount}
        {...layoutStore.headerFlags.plugins}
      />
    </>
  );
}

Layout.propTypes = {
  title: PropTypes.string,
  scrollMemo: PropTypes.bool,
};

export default observer(Layout);
