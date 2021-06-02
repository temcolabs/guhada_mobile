import css from './SearchInputFilter.module.scss';
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const SearchInputFilter = ({
  searchQueries,
  searchQueriesLength,
  handleSetSearchInput,
}) => {
  /**
   * states
   */
  const [inputValue, setInputValue] = useState('');

  /**
   * side effects
   */
  useEffect(() => {
    setInputValue('');
  }, [searchQueriesLength]);

  /**
   * handlers
   */
  const handleSearchInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setInputValue(value);

      if (searchQueriesLength !== searchQueries.length) {
        searchQueries[searchQueries.length - 1] = value;
      } else {
        searchQueries.push(value);
      }
      handleSetSearchInput(searchQueries);
    },
    [searchQueries, handleSetSearchInput, searchQueriesLength]
  );

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
  searchQueries: PropTypes.arrayOf(PropTypes.string),
  searchQueriesLength: PropTypes.number,
  handleSetSearchInput: PropTypes.func,
};

export default SearchInputFilter;
