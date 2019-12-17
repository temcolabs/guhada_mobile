import React, { useState, useEffect, useMemo } from 'react';
import css from './SearchFilterResult.module.scss';
import './SearchCategory.scss';
import cn from 'classnames';
import { inject } from 'mobx-react';
import { useObserver } from 'mobx-react-lite';
import { compose } from 'lodash/fp';
import { withRouter } from 'next/router';
import isTruthy from 'childs/lib/common/isTruthy';
import { toJS } from 'mobx';
import { getCategoryTitle } from 'utils';

const enhancer = compose(
  inject('searchitem'),
  withRouter
);

function SearchFilterResult({ searchitem, router }) {
  const [isVisible, setIsVisible] = useState(false);
  let searchFilterList = toJS(searchitem.searchFilterList);
  let brand = searchFilterList?.brand.length > 0 ? true : false;
  let filter = searchFilterList?.filter.length > 0 ? true : false;
  let subcategory = searchFilterList?.subcategory.length > 0 ? true : false;
  let category = searchFilterList?.category.length > 0 ? true : false;

  useEffect(() => {
    switch (true) {
      case brand:
        setIsVisible(true);
        break;
      case filter:
        setIsVisible(true);
        break;
      case category:
        setIsVisible(true);
        break;
      case subcategory:
        setIsVisible(true);
        break;
      default:
        setIsVisible(false);
        break;
    }
    return () => {};
  }, [brand, filter, category, subcategory]);

  return useObserver(
    () =>
      isVisible && (
        <div className={css.wrap}>
          <div className={css.buttonWrap}>
            {!subcategory &&
              category &&
              searchFilterList?.category.map(category => {
                return (
                  <button className={cn(css.colored)}>{category.title}</button>
                );
              })}
            {subcategory &&
              category &&
              searchFilterList?.subcategory.map(subcategory => {
                return (
                  <button className={cn(css.colored)}>{subcategory}</button>
                );
              })}
            {brand &&
              searchFilterList?.brand.map(brand => {
                return <button>{brand.nameDefault}</button>;
              })}
            {filter &&
              searchFilterList?.filter.map(filter => {
                return (
                  <button>
                    {isTruthy(filter.colorName)
                      ? filter.colorName
                      : filter.name}
                  </button>
                );
              })}
          </div>
        </div>
      )
  );
}
export default enhancer(SearchFilterResult);
