import css from './Layout.module.scss';
import cn from 'classnames';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';
import { useScrollDown } from 'hooks';
import Header from './Header';
import Navigation from './Navigation';
import PluginButtons from './PluginButtons';

function Layout({ title, children }) {
  /**
   * states
   */
  const { layout: layoutStore } = useStores();
  const router = useRouter();
  const isScrollDown = useScrollDown(40);

  useEffect(() => {
    layoutStore.initialize(router);

    window && window.addEventListener('popstate', layoutStore.popState);

    return () => {
      window && window.removeEventListener('popstate', layoutStore.popState);
    };
  }, []);

  /**
   * render
   */
  return (
    <div className={css['layout']}>
      <Header
        {...layoutStore.headerFlags}
        title={
          layoutStore.headerFlags.title &&
          (title || layoutStore.headerInfo.title)
        }
        isScrollDown={isScrollDown}
      />
      <section
        className={cn(
          css['content'],
          layoutStore.headerFlags.filter && css['filter-gutter']
        )}
      >
        {children}
      </section>
      <Navigation type={layoutStore.type} />
      <PluginButtons
        isScrollDown={isScrollDown}
        recentCount={layoutStore.recentCount}
        {...layoutStore.headerFlags.plugins}
      />
    </div>
  );
}

export default observer(Layout);
