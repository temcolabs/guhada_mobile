import css from './Layout.module.scss';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';
import { useScrollDown } from 'hooks';
import Header from './Header';
import Navigation from './Navigation';
import PluginButtons from './PluginButtons';

function Layout({ title, menuList, children }) {
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

    window && window.addEventListener('popstate', layoutStore.popState);

    /* TODO */
    const job = () => shoppingcartStore.globalGetUserShoppingCartList();
    user.pushJobForUserInfo(job);
    mypageRecentlySeen.init();
    category.getCategory();

    return () => {
      window && window.removeEventListener('popstate', layoutStore.popState);
    };
  }, []);

  /**
   * render
   */
  return (
    <main className={css['layout']}>
      <Header
        {...layoutStore.headerFlags}
        title={
          layoutStore.headerFlags.title &&
          (title || layoutStore.headerInfo.title)
        }
        menuList={menuList}
        cartCount={shoppingcartStore.cartAmount}
        isScrollDown={isScrollDown}
      />
      <section className={css['content']}>{children}</section>
      <Navigation
        type={layoutStore.type}
        noNav={layoutStore.headerFlags.noNav}
      />
      <PluginButtons
        isScrollDown={isScrollDown}
        recentCount={layoutStore.recentCount}
        {...layoutStore.headerFlags.plugins}
      />
    </main>
  );
}

Layout.propTypes = {
  title: PropTypes.string,
  menuList: PropTypes.array,
};

export default observer(Layout);
