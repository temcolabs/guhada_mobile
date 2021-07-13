import css from './FilterTags.module.scss';
import _ from 'lodash';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import {
  shippingConditionMap,
  productConditionMap,
} from 'stores/SearchStore/SearchByFilterStore';
import TagFactory, { CategorySearchTag } from './TagFactory';

const FilterTags = () => {
  /**
   * states
   */
  const { searchByFilter: searchByFilterStore } = useStores();
  const {
    body,
    defaultBody,
    submitFilter,
    resetFilter,
    resetBodyProp,
  } = searchByFilterStore;

  /**
   * render
   */
  return (
    searchByFilterStore.isFiltered && (
      <div className={css['filter-tags']}>
        <div className={css['tags']}>
          {body.categoryIds.length > 0 &&
            !_.isEqual(
              toJS(body.categoryIds),
              toJS(defaultBody.categoryIds)
            ) && (
              <button onClick={() => resetBodyProp('categoryIds')}>
                <CategorySearchTag categoryIds={body.categoryIds} />
              </button>
            )}
          {body.brandIds.length !== defaultBody.brandIds.length && (
            <button onClick={() => resetBodyProp('brandIds')}>브랜드</button>
          )}
          {body.shippingCondition !== defaultBody.shippingCondition && (
            <button onClick={() => resetBodyProp('shippingCondition')}>
              {shippingConditionMap.get(body.shippingCondition)}
            </button>
          )}
          {body.productCondition !== defaultBody.productCondition && (
            <button onClick={() => resetBodyProp('productCondition')}>
              {productConditionMap.get(body.productCondition)}
            </button>
          )}
          {(body.minPrice !== defaultBody.minPrice ||
            body.maxPrice !== defaultBody.maxPrice) && (
            <button onClick={() => resetBodyProp('minPrice', 'maxPrice')}>
              가격
            </button>
          )}
          {body.searchQueries.length !== defaultBody.searchQueries.length && (
            <button onClick={() => resetBodyProp('searchQueries')}>
              키워드
            </button>
          )}
          {body.filters.length !== 0 && (
            <TagFactory
              filters={toJS(body.filters)}
              submitFilter={submitFilter}
            />
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
