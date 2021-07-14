import css from './FilterOption.module.scss';
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import cn from 'classnames';
import { useScrollDown } from 'hooks';
import useStores from 'stores/useStores';
import { searchResultOrderMap } from 'stores/SearchStore/SearchByFilterStore';
import ThumbnailButton from './ThumbnailButton';
import FilterModal from './FilterModal';
import AdvancedFilterModal from './AdvancedFilterModal';

const FilterOption = ({ hide, float, sticky, specialFilterTags }) => {
  /**
   * states
   */
  const [isModalOpen, setIsModalOpen] = useState(0);
  const { searchByFilter: searchByFilterStore } = useStores();
  const isScrollDown = useScrollDown(40);
  const elementRef = useRef();

  /**
   * render
   */
  return (
    <div
      className={cn(
        css['filter-option'],
        hide && css['hide'],
        float && css['float'],
        sticky &&
          elementRef.current &&
          elementRef.current.getBoundingClientRect().top < 112 &&
          css['sticky'],
        sticky && isScrollDown && css['scroll-down']
      )}
      ref={elementRef}
    >
      <div className={css['filter-option__buttons']}>
        <div className={css['filter-button']} onClick={() => setIsModalOpen(1)}>
          {searchResultOrderMap.get(searchByFilterStore.body.searchResultOrder)}
          <div className={'misc down'} />
        </div>
        <ThumbnailButton
          thumbnail={searchByFilterStore.thumbnail}
          setThumbnail={(idx) => (searchByFilterStore.thumbnail = idx)}
        />
        <div className={css['filter-button']} onClick={() => setIsModalOpen(2)}>
          상세검색
          <div className={cn(css['filter-button--margin'], 'misc filter')} />
        </div>
      </div>

      {isModalOpen === 1 && (
        <FilterModal
          filterName={'상품정렬'}
          filterMap={searchResultOrderMap}
          selectedKey={searchByFilterStore.body.searchResultOrder}
          handleCloseModal={() => setIsModalOpen(0)}
          handleSetFilter={(key) =>
            searchByFilterStore.submitFilter({ searchResultOrder: key })
          }
          handleResetFilter={() =>
            searchByFilterStore.submitFilter({ searchResultOrder: 'DATE' })
          }
        />
      )}
      {isModalOpen === 2 && (
        <AdvancedFilterModal
          filterName={'상세검색'}
          handleCloseModal={() => setIsModalOpen(0)}
          specialFilterTags={specialFilterTags}
        />
      )}
    </div>
  );
};

FilterOption.propTypes = {
  hide: PropTypes.bool,
  float: PropTypes.bool,
  sticky: PropTypes.bool,
  specialFilterTags: PropTypes.bool,
};

export default observer(FilterOption);
