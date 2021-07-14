import css from './AdvancedFilterModal.module.scss';
import { useCallback } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import useStores from 'stores/useStores';
import ModalPortal from 'components/templates/ModalPortal';
import TreeFilter from './TreeFilter';
import DictionaryFilter from './DictionaryFilter';
import SelectionFilter from './SelectionFilter';
import ColorFilter from './ColorFilter';
import AttributeFilter from './AttributeFilter';
import PriceFilter from './PriceFilter';
import SearchInputFilter from './SearchInputFilter';
import {
  shippingConditionMap,
  productConditionMap,
  priceArrangeMap,
} from 'stores/SearchStore/SearchByFilterStore';

const AdvancedFilterModal = ({
  filterName = '상세검색',
  handleCloseModal,
  specialFilterTags,
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
    <ModalPortal handleClose={handleCloseModal} slide={1} gutter>
      <div className={css['modal__header']}>{filterName}</div>
      <div className={css['modal__filters']}>
        {!specialFilterTags && (
          <TreeFilter
            title={'카테고리'}
            dataList={searchByFilterStore.unfungibleCategories}
            currentIds={searchByFilterStore.abstractBody.categoryIds}
            setIds={(categoryIds) => handleSetAbstractFilter({ categoryIds })}
          />
        )}
        <DictionaryFilter
          title={'브랜드'}
          dataList={searchByFilterStore.brands}
          currentIds={searchByFilterStore.abstractBody.brandIds}
          setIds={(brandIds) => handleSetAbstractFilter({ brandIds })}
        />
        <SelectionFilter
          title={'배송정보'}
          mapObject={shippingConditionMap}
          selectedKey={searchByFilterStore.abstractBody.shippingCondition}
          handleSetSelected={(shippingCondition) =>
            handleSetAbstractFilter({ shippingCondition })
          }
        />
        <SelectionFilter
          title={'제품상태'}
          mapObject={productConditionMap}
          selectedKey={searchByFilterStore.abstractBody.productCondition}
          handleSetSelected={(productCondition) =>
            handleSetAbstractFilter({ productCondition })
          }
        />
        {searchByFilterStore.filters.map(
          ({ id, name, viewType, attributes }) => {
            if (viewType === 'RGB_BUTTON') {
              return (
                <ColorFilter
                  key={id}
                  title={name}
                  attributes={attributes}
                  currentFilters={searchByFilterStore.abstractBody.filters}
                  setFilters={(filters) => handleSetAbstractFilter({ filters })}
                />
              );
            }
            return (
              <AttributeFilter
                key={id}
                title={name}
                attributes={attributes}
                currentFilters={searchByFilterStore.abstractBody.filters}
                setFilters={(filters) => handleSetAbstractFilter({ filters })}
              />
            );
          }
        )}
        <PriceFilter
          title={'가격'}
          mapObject={priceArrangeMap}
          minPrice={searchByFilterStore.abstractBody.minPrice}
          maxPrice={searchByFilterStore.abstractBody.maxPrice}
          handleSetMinPrice={(minPrice) =>
            handleSetAbstractFilter({ minPrice })
          }
          handleSetMaxPrice={(maxPrice) =>
            handleSetAbstractFilter({ maxPrice })
          }
          handleSetPriceRange={(minPrice, maxPrice) =>
            handleSetAbstractFilter({ minPrice, maxPrice })
          }
        />
        <SearchInputFilter
          searchQueries={searchByFilterStore.abstractBody.searchQueries}
          handleSetSearchQuery={(searchQuery) => {
            handleSetAbstractFilter({
              searchQueries: [
                ...searchByFilterStore.defaultBody.searchQueries,
                searchQuery,
              ],
            });
          }}
        />
      </div>
      <div className={css['gutter']} />
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
    </ModalPortal>
  );
};

AdvancedFilterModal.propTypes = {
  filterName: PropTypes.string,
  handleCloseModal: PropTypes.func,
  specialFilterTags: PropTypes.bool,
};

export default observer(AdvancedFilterModal);
