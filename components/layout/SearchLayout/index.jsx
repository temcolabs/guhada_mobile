import css from './SearchLayout.module.scss';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import { useScrollDown } from 'hooks';
import Header from './Header';
import Navigation from './Navigation';
import PluginButtons from './PluginButtons';

function SearchLayout({ type = 'default', children }) {
  /**
   * states
   */
  const { layout: layoutStore } = useStores();
  const isScrollDown = useScrollDown();

  /**
   * side effects
   */
  useEffect(() => {
    layoutStore.initialize(type);
  }, [layoutStore, type]);

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
        category={
          layoutStore.headerFlags.category && !!layoutStore.headerInfo.category
        }
        filter={layoutStore.headerFlags.filter}
        isScrollDown={!layoutStore.headerFlags.fixed && isScrollDown}
      />
      <section className={css['content']}>{children}</section>
      <Navigation />
      <PluginButtons
        isScrollDown={isScrollDown}
        recentCount={layoutStore.recentCount}
        {...layoutStore.headerFlags.plugins}
      />
    </div>
  );
}

SearchLayout.propTypes = {
  type: PropTypes.string,
};

export default observer(SearchLayout);
