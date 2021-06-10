import css from './SearchLayout.module.scss';
import PropTypes from 'prop-types';
import Header from './Header';
import Navigation from './Navigation';
import PluginButtons from './PluginButtons';

function SearchLayout({
  logo,
  title,
  back,
  home,
  category,
  isScrollDown,
  plugins,
  children,
}) {
  /**
   * render
   */
  return (
    <div className={css['layout']}>
      <Header
        logo={logo}
        title={title}
        back={back}
        home={home}
        category={category}
        isScrollDown={isScrollDown}
      />
      <section className={css['content']}>{children}</section>
      <Navigation />
      <PluginButtons {...plugins} />
    </div>
  );
}

SearchLayout.propTypes = {
  logo: PropTypes.bool,
  title: PropTypes.string,
  back: PropTypes.bool,
  home: PropTypes.bool,
  category: PropTypes.bool,
  isScrollDown: PropTypes.bool,
  plugins: PropTypes.shape({
    top: PropTypes.bool,
    kakao: PropTypes.bool,
    history: PropTypes.shape({
      count: PropTypes.number,
    }),
  }),
};

export default SearchLayout;
