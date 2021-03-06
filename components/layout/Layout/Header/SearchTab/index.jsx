import css from './SearchTab.module.scss';
import { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import SearchMenu from './SearchMenu';
import AutocompleteSearchMenu from './AutocompleteSearchMenu';
import { pushRoute } from 'childs/lib/router';
import ModalPortal from 'components/templates/ModalPortal';

const SearchTab = () => {
  /**
   * states
   */
  const {
    newMain: newMainStore,
    searchByFilter: searchByFilterStore,
    keyword: keywordStore,
  } = useStores();
  const [isExpand, setIsExpand] = useState(0);
  const [searchInput, setSearchInput] = useState(() =>
    searchByFilterStore.body.searchQueries.length > 0
      ? searchByFilterStore.body.searchQueries[0]
      : ''
  );

  /**
   * handlers
   */
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
      keywordStore.addItem(input.word);
      pushRoute(`/search?keyword=${input.word}`);
      setIsExpand(0);
      return;
    }
    if (!input.trim()) {
      setIsExpand(0);
      return;
    }
    setIsExpand(0);
    keywordStore.addItem(input);
    pushRoute(`/search?keyword=${input}`);
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
        placeholder={newMainStore.mainData.placeholder || '검색하기'}
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
      {isExpand > 0 && (
        <ModalPortal shade={false} gutter minHeight>
          <SearchMenu handleSearch={handleSearch} />
          {isExpand === 2 && (
            <AutocompleteSearchMenu
              list={keywordStore.autoCompleteList}
              handleSearch={handleSearch}
              fixed
            />
          )}
        </ModalPortal>
      )}
    </div>
  );
};

export default observer(SearchTab);
