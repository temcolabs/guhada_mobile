import css from './SearchLayout.module.scss';
import cn from 'classnames';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';
import { useScrollDown } from 'hooks';
import Header from './Header';
import Navigation from './Navigation';
import PluginButtons from './PluginButtons';

function SearchLayout({ children }) {
  /**
   * states
   */
  const { layout: layoutStore } = useStores();
  const router = useRouter();
  const isScrollDown = useScrollDown(60);

  useEffect(() => {
    layoutStore.initialize(router.query);

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
        logo={layoutStore.headerFlags.logo}
        title={layoutStore.headerFlags.title && layoutStore.headerInfo.title}
        back={layoutStore.headerFlags.back}
        home={layoutStore.headerFlags.home}
        category={layoutStore.headerFlags.category}
        filter={layoutStore.headerFlags.filter}
        slide={layoutStore.headerFlags.slide}
        searchbox={layoutStore.headerFlags.searchbox}
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

export default observer(SearchLayout);
