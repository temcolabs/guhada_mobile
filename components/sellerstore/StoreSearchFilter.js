import React, { Component } from 'react';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import css from './StoreSearchFilter.module.scss';
import cn from 'classnames';
import Router from 'next/router';
import RgbButton from 'components/search/RgbButton';
import TextButton from 'components/search/TextButton';
import memoize from 'memoize-one';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { conditionOption } from 'childs/lib/constant/filter/condition';
import { internationalShippingOptions } from 'childs/lib/constant/filter/internationalShipping';
import { brandNewOptions } from 'childs/lib/constant/filter/brandNew';
import ResultSearchFilter from 'components/search/ResultSearchFilter';
import PriceFilter from 'components/search/PriceFilter';
import SearchCategory from 'components/search/SearchCategory';
import SearchBrand from 'components/search/SearchBrand';
import TextButtonCondition from 'components/search/TextButtonCondition';
@inject('brands', 'searchitem')
@observer
class StoreSearchFilter extends Component {
  componentDidUpdate(prevProps, prevState) {
    this.setBrandData(this.props.isVisible);
  }
  // isVisible
  setBrandData = memoize(isVisible => {
    const { brands, searchitem } = this.props;
    if (isVisible === false) {
      searchitem.initFilter();
      brands.getBrands();
    } else {
      brands.setBrandsFromFilter(searchitem.item?.brands);
    }
  });

  render() {
    const { isVisible, onClose, searchitem } = this.props;

    return (
      <SlideIn isVisible={isVisible} direction={slideDirection.BOTTOM}>
        <div className={css.wrap} ref="filterScroll">
          <button className={css.close} onClick={onClose} />
          <div className={css.header}>상세검색</div>
          <div className={css.itemWrap}>
            <SearchCategory />
            <SearchBrand />

            <TextButtonCondition
              title={conditionOption.internationalShipping}
              data={internationalShippingOptions}
            />
            <TextButtonCondition
              title={conditionOption.brandNew}
              data={brandNewOptions}
            />

            {toJS(searchitem.filterData)
              ? toJS(searchitem.filterData).map((filter, i) => {
                  if (filter.viewType === 'RGB_BUTTON') {
                    return <RgbButton filter={filter} key={i} />;
                  } else {
                    return <TextButton filter={filter} key={i} />;
                  }
                })
              : null}
            <PriceFilter query={Router.router.query} />
            <ResultSearchFilter />
          </div>
          <div className={css.button}>
            <button
              className={css.init}
              onClick={() => {
                searchitem.clearFilter();
                this.refs.filterScroll.scrollTo(0, 0);
              }}
            >
              초기화
            </button>
            <button
              className={css.search}
              onClick={() => {
                searchitem.searchFilter();
              }}
            >
              검색결과 보기
            </button>
          </div>
        </div>
      </SlideIn>
    );
  }
}

export default StoreSearchFilter;
