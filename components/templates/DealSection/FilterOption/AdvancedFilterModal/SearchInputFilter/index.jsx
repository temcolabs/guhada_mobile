import css from './SearchInputFilter.module.scss';
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { debounce as _debounce } from 'lodash';

const SearchInputFilter = ({ searchQueries, handleSetSearchQuery }) => {
  /**
   * states
   */
  const [inputValue, setInputValue] = useState('');

  /**
   * side effects
   */
  useEffect(() => {
    if (searchQueries.length === 0) {
      setInputValue('');
    }
  }, [searchQueries]);

  /**
   * handlers
   */
  const debouncedSetSearchQuery = useCallback(
    _debounce((value) => {
      if (value === '') {
        handleSetSearchQuery([]);
      } else {
        handleSetSearchQuery(value);
      }
    }, 200)
  );

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    // TODO: serializer
    setInputValue(value);
    debouncedSetSearchQuery(value);
  };

  return (
    <div className={css['search']}>
      <input
        type="text"
        className={css['search__input']}
        onChange={handleSearchInputChange}
        value={inputValue}
        placeholder="결과 내 재검색"
      />
    </div>
  );
};

SearchInputFilter.propTypes = {
  searchQueries: PropTypes.any,
  handleSetSearchQuery: PropTypes.func,
};

export default SearchInputFilter;
