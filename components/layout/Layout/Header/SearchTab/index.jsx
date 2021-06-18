import css from './SearchTab.module.scss';
import { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import SearchMenu from './SearchMenu';
import AutocompleteSearchMenu from './AutocompleteSearchMenu';

const SearchTab = () => {
  /**
   * states
   */
  const {
    searchByFilter: searchByFilterStore,
    keyword: keywordStore,
    searchHolder: searchHolderStore,
  } = useStores();
  const [isExpand, setIsExpand] = useState(0);

  const searchInput =
    searchByFilterStore.abstractBody.searchQueries.length > 0
      ? searchByFilterStore.abstractBody.searchQueries[0]
      : '';

  /**
   * handlers
   */
  const setSearchInput = (value) => {
    searchByFilterStore.setAbstractFilter({ searchQueries: [value] });
  };
  const handleBackClick = () => {
    if (isExpand) {
      setIsExpand(0);
    } else {
      window.history.back();
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      return handleSearch(searchInput);
    }
    if (keywordStore.autoComplete) {
      if (!searchInput) {
        setIsExpand(0);
        return;
      }
      keywordStore.getAutoComplete(searchInput);
      setIsExpand(2);
    }
  };

  const handleSearch = useCallback((input) => {
    if (typeof input === 'object' && input.word) {
      searchByFilterStore.initializeSearch({ searchQueries: [input.word] });
      keywordStore.addItem(input.word);
      setIsExpand(0);
      return;
    }
    if (!input.trim()) {
      setIsExpand(0);
      return;
    }
    setIsExpand(0);
    keywordStore.addItem(input);
    searchByFilterStore.initializeSearch({ searchQueries: [input] });
  }, []);

  const handleDelete = () => {
    setSearchInput('');
    setIsExpand(0);
  };

  /**
   * side effects
   */
  useEffect(() => {
    if (isExpand > 0) {
      document.body.style.overflow = 'hidden';
    }
    return () => (document.body.style.overflow = 'unset');
  }, [isExpand]);

  /**
   * render
   */
  return (
    <div className={css['tab']}>
      <div className={css['tab__buttons']}>
        <div
          className={cn(css['button'], css['button--back'])}
          onClick={handleBackClick}
        />
      </div>
      <input
        type="text"
        value={searchInput}
        placeholder={searchHolderStore.placeholderData?.placeholder}
        onKeyUp={handleKeyUp}
        onChange={(e) => setSearchInput(e.target.value)}
        onFocus={() => setIsExpand(1)}
        onClick={() => setIsExpand(1)}
      />
      <div className={css['tab__buttons']}>
        {searchInput && (
          <div
            className={cn(css['button'], css['button--delete'])}
            onClick={handleDelete}
          />
        )}
        <div
          className={cn(css['button'], css['button--search'])}
          onClick={() => handleSearch(searchInput)}
        />
      </div>
      {isExpand === 1 && <SearchMenu handleSearch={handleSearch} />}
      {isExpand === 2 && (
        <AutocompleteSearchMenu
          list={keywordStore.autoCompleteList}
          handleSearch={handleSearch}
        />
      )}
    </div>
  );
};

export default observer(SearchTab);
