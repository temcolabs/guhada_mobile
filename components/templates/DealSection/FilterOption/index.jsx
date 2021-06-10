import css from './FilterOption.module.scss';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import cn from 'classnames';
import useStores from 'stores/useStores';
import { searchResultOrderMap } from 'stores/SearchStore/SearchByFilterStore';
import ThumbnailButton from './ThumbnailButton';
import FilterTags from './FilterTags';
import FilterModal from './FilterModal';
import AdvancedFilterModal from './AdvancedFilterModal';

const FilterOption = ({ scrollDirection }) => {
  /**
   * states
   */
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAdvancedFilterModalOpen, setIsAdvancedFilterModalOpen] = useState(
    false
  );
  const { searchByFilter: searchByFilterStore } = useStores();

  /**
   * render
   */
  return (
    <>
      <div className={css['filter-option']}>
        <div className={cn(css['filter-option__buttons'], css['hang'])}>
          <div
            className={cn(css['filter-button'], css['button--order'])}
            onClick={() => {
              setIsFilterModalOpen(true);
            }}
          >
            {searchResultOrderMap.get(
              searchByFilterStore.body.searchResultOrder
            )}
          </div>
          <ThumbnailButton
            thumbnail={searchByFilterStore.thumbnail}
            setThumbnail={(idx) => (searchByFilterStore.thumbnail = idx)}
          />
          <div
            className={cn(css['filter-button'], css['button--advanced'])}
            onClick={() => {
              setIsAdvancedFilterModalOpen(true);
            }}
          >
            상세검색
          </div>
        </div>
        <FilterTags />
      </div>

      <FilterModal
        filterName={'상품정렬'}
        filterMap={searchResultOrderMap}
        selectedKey={searchByFilterStore.body.searchResultOrder}
        isModalOpen={isFilterModalOpen}
        handleCloseModal={() => setIsFilterModalOpen(false)}
        handleSetFilter={(key) =>
          searchByFilterStore.submitFilter({ searchResultOrder: key })
        }
        handleResetFilter={() =>
          searchByFilterStore.submitFilter({ searchResultOrder: 'DATE' })
        }
      />
      <AdvancedFilterModal
        filterName={'상세검색'}
        isModalOpen={isAdvancedFilterModalOpen}
        handleCloseModal={() => setIsAdvancedFilterModalOpen(false)}
      />
    </>
  );
};

FilterOption.propTypes = {
  scrollDirection: PropTypes.string,
};

export default observer(FilterOption);
