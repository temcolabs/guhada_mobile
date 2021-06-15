import css from './SearchLayout.module.scss';
import { observer } from 'mobx-react';
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
  const isScrollDown = useScrollDown(60);

  /**
   * render
   */
  return (
    <div className={css['layout']}>
      <Header
        logo={layoutStore.headerFlags.logo}
        title={layoutStore.headerFlags.title && layoutStore.headerInfo.title}
        back={layoutStore.headerFlags.back}
        popHistory={layoutStore.popHistory}
        home={layoutStore.headerFlags.home}
        category={
          layoutStore.headerFlags.category && !!layoutStore.headerInfo.category
        }
        filter={layoutStore.headerFlags.filter}
        isScrollDown={layoutStore.headerFlags.slide && isScrollDown}
      />
      <section className={css['content']}>{children}</section>
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
