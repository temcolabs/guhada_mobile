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
        띄어쓰기를 변경하거나 다른 검색어로 검색해보세요.
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
