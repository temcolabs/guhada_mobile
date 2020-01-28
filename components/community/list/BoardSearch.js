import React, { useState } from 'react';
import _ from 'lodash';
import css from './BoardSearch.module.scss';
import SearchInputOption from './SearchInputOption';
import SearchInput from '../form/SearchInput';
import { searchTypeOptions } from 'childs/lib/constant/community/searchType';
import { useObserver } from 'mobx-react-lite';

/**
 * 게시판 검색
 */
export default function BoardSearch({
  wrapperStyle = {},
  onSubmitSearch = () => {},
  initialSearchType = searchTypeOptions[0],
  initialQuery = '',
}) {
  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState(initialSearchType);

  const handleSelectOption = value => {
    setSearchType(value);
  };

  const handleChangeQuery = v => {
    setQuery(v);
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmitSearch({
      searchType,
      query,
    });
  };

  return useObserver(() => (
    <form className={css.wrap} style={wrapperStyle} onSubmit={handleSubmit}>
      <div>
        <SearchInputOption
          options={searchTypeOptions}
          initialValue={initialSearchType}
          onChange={handleSelectOption}
        />
      </div>
      <div>
        <SearchInput initialValue={initialQuery} onChange={handleChangeQuery} />
      </div>
    </form>
  ));
}
