import React from 'react';
import css from './SearchResultEmpty.module.scss';

export default function SearchResultEmpty({
  title = '',
  setIsSearchVisible = () => {},
  setKeywordText = () => {},
}) {
  return (
    <div className={css.wrap}>
      <div className={css.searchResult}>{title}</div>
      <div className={css.label}>검색결과가 없습니다.</div>
      <div className={css.subLabel}>
        검색 옵션을 변경하여 다시 검색해 보세요.
      </div>
      <button
        onClick={() => {
          setIsSearchVisible(true);
          setKeywordText('');
        }}
      >
        검색 초기화
      </button>
    </div>
  );
}
