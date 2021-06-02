import css from './AdvancedFilterModal.module.scss';
import { useCallback } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import useStores from 'stores/useStores';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import TreeFilter from './TreeFilter';
import SearchableTreeFilter from './SearchableTreeFilter';
import SelectionFilter from './SelectionFilter';
import PriceFilter from './PriceFilter';
import SearchInputFilter from './SearchInputFilter';
import {
  shippingConditionMap,
  productConditionMap,
  priceArrangeMap,
} from 'stores/SearchStore/SearchByFilterStore';

const AdvancedFilterModal = ({
  filterName = '상세검색',
  isModalOpen,
  handleCloseModal,
}) => {
  /**
   * states
   */
  const { searchByFilter: searchByFilterStore } = useStores();

  /**
   * handlers
   */
  const handleSetAbstractFilter = useCallback(
    (body = searchByFilterStore.defaultBody) => {
      searchByFilterStore.setAbstractFilter(body);
    },
    [searchByFilterStore]
  );
  const handleResetAbstractFilter = () => {
    searchByFilterStore.resetAbstractFilter();
  };
  const handleSubmitAbstractFilter = () => {
    searchByFilterStore.submitAbstractFilter();
    handleCloseModal();
  };

  /**
   * render
   */
  return (
    <SlideIn direction={slideDirection.BOTTOM} isVisible={isModalOpen}>
      <div className={css['filter-modal']}>
        <div className={css['modal__offset']} onClick={handleCloseModal} />
        <div className={css['modal__header']}>{filterName}</div>
        <div className={css['modal__filters']}>
          <TreeFilter
            title={'카테고리'}
            dataList={searchByFilterStore.categories}
            currentIds={searchByFilterStore.abstractBody.categoryIds}
            setIds={(categoryIds) => handleSetAbstractFilter({ categoryIds })}
          />
          <SearchableTreeFilter
            title={'브랜드'}
            dataList={searchByFilterStore.brands}
            currentIds={searchByFilterStore.abstractBody.brandIds}
            setIds={(brandIds) => handleSetAbstractFilter({ brandIds })}
          />
          <SelectionFilter
            title={'배송정보'}
            mapObject={shippingConditionMap}
            defaultValue={'ANY'}
            handleSetSelected={(shippingCondition) =>
              handleSetAbstractFilter({ shippingCondition })
            }
          />
          <SelectionFilter
            title={'제품상태'}
            mapObject={productConditionMap}
            defaultValue={'ANY'}
            handleSetSelected={(productCondition) =>
              handleSetAbstractFilter({ productCondition })
            }
          />
          <PriceFilter
            title={'가격'}
            mapObject={priceArrangeMap}
            isInitial={
              searchByFilterStore.body.minPrice === 0 &&
              searchByFilterStore.body.maxPrice === 0
            }
            handleSetPriceRange={(minPrice, maxPrice) =>
              handleSetAbstractFilter({ minPrice, maxPrice })
            }
          />
          <SearchInputFilter
            searchQueries={toJS(searchByFilterStore.abstractBody.searchQueries)}
            searchQueriesLength={searchByFilterStore.body.searchQueries.length}
            handleSetSearchInput={(searchQueries) => {
              handleSetAbstractFilter({ searchQueries });
            }}
          />
        </div>
        <div className={css['modal__buttons']}>
          <button
            className={css['button--reset']}
            onClick={handleResetAbstractFilter}
          >
            초기화
          </button>
          <button
            className={css['button--submit']}
            onClick={handleSubmitAbstractFilter}
          >
            검색결과 보기
          </button>
        </div>
      </div>
    </SlideIn>
  );
};

AdvancedFilterModal.propTypes = {
  filterName: PropTypes.string,
  isModalOpen: PropTypes.bool,
  handleCloseModal: PropTypes.func,
};

export default observer(AdvancedFilterModal);
