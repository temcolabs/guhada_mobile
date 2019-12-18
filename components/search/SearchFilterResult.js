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
import { getCategory } from 'utils';
import addCommaToArray from 'childs/lib/string/addCommaToArray';
import { isArray } from 'util';

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
  let category =
    searchFilterList?.category.length > 0 &&
    searchFilterList?.category[0]?.id !== ''
      ? true
      : false;

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
  }, [brand, filter, category, subcategory, searchitem]);

  const toSearch = ({
    category = '',
    brand = '',
    subcategory = '',
    filter = '',
    reset = false,
  }) => {
    let query = router.query;
    let queryFilter = query.filter;
    let queryBrand = query.brand;
    let querySubcategory = query.subcategory;
    let queryCategory = query.category;
    let enter = query.enter;

    // 상세 검색 필터
    if (category !== '') {
      if (enter === 'category') {
        queryCategory = getCategory(
          searchitem.locationFilter,
          queryCategory
        ).hierarchy.split(',')[0];
      } else {
        queryCategory = '';
      }
    }

    if (subcategory !== '') {
      querySubcategory = querySubcategory.split(',');
      querySubcategory.splice(querySubcategory.indexOf(String(subcategory)), 1);
    }

    if (filter !== '') {
      queryFilter = queryFilter.split(',');
      queryFilter.splice(queryFilter.indexOf(String(filter)), 1);
    }

    if (brand !== '') {
      queryBrand = queryBrand.split(',');
      queryBrand.splice(queryBrand.indexOf(String(brand)), 1);
    }

    if (reset) {
      if (enter === 'category') {
        queryCategory = getCategory(
          searchitem.locationFilter,
          queryCategory
        ).hierarchy.split(',')[0];
        queryBrand = '';
        queryFilter = '';
        querySubcategory = '';
      } else if (enter === 'brand') {
        queryCategory = '';
        queryBrand = queryBrand.split(',')[0];
        queryFilter = '';
        querySubcategory = '';
      } else if (enter === 'keyword') {
        queryCategory = '';
        queryBrand = '';
        queryFilter = '';
        querySubcategory = '';
      }

      searchitem.initSearchFilterList();
    }

    searchitem.toSearch({
      category: queryCategory,
      brand: isArray(queryBrand) ? addCommaToArray(queryBrand) : queryBrand,
      filter: isArray(queryFilter) ? addCommaToArray(queryFilter) : queryFilter,
      subcategory: isArray(querySubcategory)
        ? addCommaToArray(querySubcategory)
        : querySubcategory,
      filtered: true,
    });
  };

  return useObserver(
    () =>
      isVisible && (
        <div className={css.wrap}>
          <div className={css.buttonWrap}>
            {!subcategory &&
              category &&
              searchitem.searchFilterList?.category.map((category, index) => {
                return (
                  <button
                    className={cn(css.colored)}
                    key={index}
                    onClick={() => {
                      searchitem.searchFilterList.category.splice(index, 1);
                      toSearch({ category: category.id });
                    }}
                  >
                    {category.title}
                  </button>
                );
              })}
            {subcategory &&
              category &&
              searchitem.searchFilterList?.subcategory.map(
                (subcategory, index) => {
                  return (
                    <button
                      className={cn(css.colored)}
                      onClick={() => {
                        searchitem.searchFilterList.subcategory.splice(
                          index,
                          1
                        );
                        toSearch({ subcategory: subcategory.id });
                      }}
                      key={index}
                    >
                      {subcategory.title}
                    </button>
                  );
                }
              )}
            {brand &&
              searchitem.searchFilterList?.brand.map((brand, index) => {
                return (
                  <button
                    onClick={() => {
                      searchitem.searchFilterList.brand.splice(index, 1);
                      toSearch({ brand: brand.id });
                    }}
                    key={index}
                  >
                    {brand.nameDefault}
                  </button>
                );
              })}
            {filter &&
              searchitem.searchFilterList?.filter.map((filter, index) => {
                return (
                  <button
                    onClick={() => {
                      searchitem.searchFilterList.filter.splice(index, 1);
                      toSearch({ filter: filter.id });
                    }}
                    key={index}
                  >
                    {isTruthy(filter.colorName)
                      ? filter.colorName
                      : filter.name}
                  </button>
                );
              })}
            <img
              src={'/static/icon/btn_filter_reset@3x.png'}
              width={93}
              height={27}
              onClick={() => toSearch({ reset: true })}
            />
          </div>
        </div>
      )
  );
}
export default enhancer(SearchFilterResult);
