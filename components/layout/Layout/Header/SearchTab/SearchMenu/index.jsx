import css from './SearchMenu.module.scss';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import cn from 'classnames';
import useStores from 'stores/useStores';
import KeywordSection from './KeywordSection';
import RankingSection from 'template/Ranking/RankingSection';
import { useVerticalArrows } from 'hooks';

const SearchMenu = ({ handleSearch, fixed, height }) => {
  /**
   * states
   */
  const { keyword: keywordStore, ranking: rankingStore } = useStores();
  const [selected, setSelected] = useState(0);
  const [scrollRef, arrowTop, arrowBottom] = useVerticalArrows();

  /**
   * handlers
   */
  const handleSetSelected = (value) => {
    if (value === 0) {
      keywordStore.getListFromStorage();
    } else {
      rankingStore.setSelectedRanking('word');
    }
    setSelected(value);
  };

  /**
   * render
   */
  return (
    <div className={cn(css['search-menu'], fixed && css['fixed'])}>
      <div className={css['menu__selection']}>
        <div
          className={cn(
            css['selection-button'],
            selected === 0 && css['selected']
          )}
          onClick={() => handleSetSelected(0)}
        >
          최근 검색어
        </div>
        <div
          className={cn(
            css['selection-button'],
            selected === 1 && css['selected']
          )}
          onClick={() => handleSetSelected(1)}
        >
          인기 검색어
        </div>
      </div>
      <div
        style={{ height: `calc(${height}px - 160px)` }}
        className={css['menu__content']}
        ref={scrollRef}
      >
        {selected === 0 ? (
          <KeywordSection
            list={keywordStore.list}
            handleSearch={handleSearch}
            handleDelete={keywordStore.removeItem}
          />
        ) : (
          <RankingSection
            rank={rankingStore.ranking.rank}
            handleSearch={handleSearch}
            count={10}
          />
        )}
        {arrowTop && (
          <span
            className={cn(css['tab-arrow'], css['arrow--top'], 'misc down')}
          />
        )}
        {arrowBottom && (
          <span
            className={cn(css['tab-arrow'], css['arrow--bottom'], 'misc down')}
          />
        )}
      </div>
      <div className={css['menu__autocomplete']}>
        <div
          className={css['auto-text']}
          onClick={keywordStore.setAutocomplete}
        >
          자동완성
          <div
            className={cn(
              css['auto-toggle'],
              !keywordStore.autoComplete && css['auto-toggle--off']
            )}
          />
        </div>
        <div
          className={css['auto-delete']}
          onClick={keywordStore.removeItemAll}
        >
          전체삭제
        </div>
      </div>
    </div>
  );
};

SearchMenu.propTypes = {
  handleSearch: PropTypes.func,
  fixed: PropTypes.bool,
  height: PropTypes.number,
};

export default observer(SearchMenu);
