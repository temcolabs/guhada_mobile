import css from './AutocompleteSearchMenu.module.scss';
import PropTypes from 'prop-types';

const AutocompleteSearchMenu = ({ list, handleSearch }) => {
  return (
    <div className={css['search-menu']}>
      {list.length > 0 &&
        list.map((text) => (
          <div
            key={text}
            className={css['item']}
            onClick={() => handleSearch(text)}
          >
            {text}
          </div>
        ))}
    </div>
  );
};

AutocompleteSearchMenu.propTypes = {
  list: PropTypes.any,
  handleSearch: PropTypes.func,
};

export default AutocompleteSearchMenu;
