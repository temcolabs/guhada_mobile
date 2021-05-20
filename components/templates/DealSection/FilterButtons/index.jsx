import css from './FilterButtons.module.scss';
import { useState, useEffect } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import cn from 'classnames';
import useStores from 'stores/useStores';
import {
  searchResultOrderMap,
  shippingConditionMap,
  productConditionMap,
} from 'stores/SearchStore/SearchByFilterStore';
import FilterModal from './FilterModal';

const FilterButtons = () => {
  /**
   * states
   */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { searchByFilter: searchByFilterStore } = useStores();

  /**
   * side effects
   */

  /**
   * handlers
   */
  const handleOpenOrderModal = () => {};
  const handleOpenOptionsModal = () => {};
  const handleResetFilter = () => {
    searchByFilterStore.resetAbstractFilter();
  };
  const handleSubmitFilter = () => {
    searchByFilterStore.submitAbstractFilter();
  };

  /**
   * render
   */
  return (
    <>
      <div className={css['filter-buttons']}>
        <div
          className={cn(css['filter-button'], css['button--order'])}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          {searchResultOrderMap.get(searchByFilterStore.body.searchResultOrder)}
          <div className={css['order-icon']} />
        </div>
        <div
          className={cn(css['filter-button'], css['button--options'])}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          상세검색
          <div className={css['options-icon']} />
        </div>
      </div>

      <FilterModal
        isModalOpen={isModalOpen}
        handleCloseModal={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default observer(FilterButtons);
