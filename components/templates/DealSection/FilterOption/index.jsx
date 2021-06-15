import css from './FilterOption.module.scss';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import cn from 'classnames';
import useStores from 'stores/useStores';
import { searchResultOrderMap } from 'stores/SearchStore/SearchByFilterStore';
import ThumbnailButton from './ThumbnailButton';
import FilterModal from './FilterModal';
import AdvancedFilterModal from './AdvancedFilterModal';

const FilterOption = ({ hide, float }) => {
  /**
   * states
   */
  const [isModalOpen, setIsModalOpen] = useState(0);
  const { searchByFilter: searchByFilterStore } = useStores();

  /**
   * render
   */
  return (
    <div
      className={cn(
        css['filter-option'],
        float && css['float'],
        hide && css['hide']
      )}
    >
      <div className={css['filter-option__buttons']}>
        <div
          className={cn(css['filter-button'], css['button--order'])}
          onClick={() => setIsModalOpen(1)}
        >
          {searchResultOrderMap.get(searchByFilterStore.body.searchResultOrder)}
        </div>
        <ThumbnailButton
          thumbnail={searchByFilterStore.thumbnail}
          setThumbnail={(idx) => (searchByFilterStore.thumbnail = idx)}
        />
        <div
          className={cn(css['filter-button'], css['button--advanced'])}
          onClick={() => setIsModalOpen(2)}
        >
          상세검색
        </div>
      </div>

      <FilterModal
        filterName={'상품정렬'}
        filterMap={searchResultOrderMap}
        selectedKey={searchByFilterStore.body.searchResultOrder}
        isModalOpen={isModalOpen === 1}
        handleCloseModal={() => setIsModalOpen(0)}
        handleSetFilter={(key) =>
          searchByFilterStore.submitFilter({ searchResultOrder: key })
        }
        handleResetFilter={() =>
          searchByFilterStore.submitFilter({ searchResultOrder: 'DATE' })
        }
      />
      <AdvancedFilterModal
        filterName={'상세검색'}
        isModalOpen={isModalOpen === 2}
        handleCloseModal={() => setIsModalOpen(0)}
      />
    </div>
  );
};

FilterOption.propTypes = {
  hide: PropTypes.bool,
  float: PropTypes.bool,
};

export default observer(FilterOption);
