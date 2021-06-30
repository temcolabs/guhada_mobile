import css from './SearchModal.module.scss';
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import ModalPortal from 'components/templates/ModalPortal';
import SearchMenu from '../SearchTab/SearchMenu';
import AutocompleteSearchMenu from '../SearchTab/AutocompleteSearchMenu';
import { pushRoute } from 'childs/lib/router';

const SearchModal = ({ handleClose }) => {
  /**
   * states
   */
  const { newMain: newMainStore, keyword: keywordStore } = useStores();
  const [isExpand, setIsExpand] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  /**
   * handlers
   */
  const handleBackClick = () => {
    setIsExpand(0);
    handleClose();
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
   * render
   */
  return (
    <ModalPortal handleClose={handleClose} slide={3} closeButton={false}>
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
      </div>
      <SearchMenu handleSearch={handleSearch} />
      {isExpand === 2 && (
        <AutocompleteSearchMenu
          list={keywordStore.autoCompleteList}
          handleSearch={handleSearch}
        />
      )}
    </ModalPortal>
  );
};

SearchModal.propTypes = {
  handleClose: PropTypes.func,
};

export default observer(SearchModal);
