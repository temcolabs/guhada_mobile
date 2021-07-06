import css from './AutocompleteSearchMenu.module.scss';
import cn from 'classnames';
import PropTypes from 'prop-types';

const AutocompleteSearchMenu = ({ list, handleSearch, fixed }) => (
  <div className={cn(css['search-menu'], fixed && css['fixed'])}>
    {list.length > 0 &&
      list.map((text) => (
        <div
          key={text}
          className={css['item']}
          onClick={() => handleSearch(text)}
        >
          {text}
          <div className={cn(css['item-icon'], 'misc arrow-diagonal')} />
        </div>
      ))}
  </div>
);

AutocompleteSearchMenu.propTypes = {
  list: PropTypes.any,
  handleSearch: PropTypes.func,
  fixed: PropTypes.bool,
};

export default AutocompleteSearchMenu;
