import css from './FilterTags.module.scss';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import {
  searchResultOrderMap,
  shippingConditionMap,
  productConditionMap,
} from 'stores/SearchStore/SearchByFilterStore';

const FilterTags = () => {
  /**
   * states
   */
  const { searchByFilter: searchByFilterStore } = useStores();

  /**
   * handlers
   */
  const body = searchByFilterStore.body;
  const submitFilter = searchByFilterStore.submitFilter;
  const resetFilter = searchByFilterStore.resetFilter;

  /**
   * render
   */
  return (
    searchByFilterStore.isFiltered && (
      <div className={css['filter-tags']}>
        <div className={css['tags']}>
          {body.categoryIds.length !== 0 && (
            <button onClick={() => submitFilter({ categoryIds: [] })}>
              카테고리
            </button>
          )}

          {body.brandIds.length !== 0 && (
            <button onClick={() => submitFilter({ brandIds: [] })}>
              브랜드
            </button>
          )}
          {body.shippingCondition !== 'ANY' && (
            <button onClick={() => submitFilter({ shippingCondition: 'ANY' })}>
              {shippingConditionMap.get(body.shippingCondition)}
            </button>
          )}
          {body.productCondition !== 'ANY' && (
            <button onClick={() => submitFilter({ productCondition: 'ANY' })}>
              {productConditionMap.get(body.productCondition)}
            </button>
          )}
          {(body.minPrice !== 0 || body.maxPrice !== 0) && (
            <button onClick={() => submitFilter({ minPrice: 0, maxPrice: 0 })}>
              가격
            </button>
          )}
          {body.searchQueries.length !== 0 && (
            <button onClick={() => submitFilter({ searchQueries: [] })}>
              키워드
            </button>
          )}
        </div>
        <button className={css['reset']} onClick={resetFilter}>
          초기화
        </button>
      </div>
    )
  );
};

export default observer(FilterTags);
