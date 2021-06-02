import css from './FilterOption.module.scss';
import { useState } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';
import useStores from 'stores/useStores';
import { searchResultOrderMap } from 'stores/SearchStore/SearchByFilterStore';
import FilterTags from './FilterTags';
import FilterModal from './FilterModal';
import AdvancedFilterModal from './AdvancedFilterModal';

const FilterOption = () => {
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
        <div className={css['filter-option__buttons']}>
          <div
            className={cn(css['filter-button'], css['button--order'])}
            onClick={() => {
              setIsFilterModalOpen(true);
            }}
          >
            {searchResultOrderMap.get(
              searchByFilterStore.body.searchResultOrder
            )}
            <span className={css['icon--order']} />
          </div>
          <div
            className={cn(css['filter-button'], css['button--advanced'])}
            onClick={() => {
              setIsAdvancedFilterModalOpen(true);
            }}
          >
            상세검색
            <span className={css['icon--advanced']} />
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

export default observer(FilterOption);
