import React, { Component } from 'react';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import css from './SearchFilter.module.scss';
import cn from 'classnames';
import Router from 'next/router';
import RgbButton from './RgbButton';
import TextButton from './TextButton';
import SearchCategory from './SearchCategory';
import SearchBrand from './SearchBrand';
import memoize from 'memoize-one';
import { inject, observer } from 'mobx-react';

@inject('brands', 'searchitem')
@observer
class SearchFilter extends Component {
  componentDidUpdate(prevProps, prevState) {
    this.setBrandData(this.props.isVisible);
  }
  // isVisible
  setBrandData = memoize(isVisible => {
    console.log('isVisible', isVisible);
    const { brands, searchitem } = this.props;
    if (isVisible === false) {
      searchitem.initFilter();
    } else {
      brands.setBrandsFromFilter(searchitem.item?.brands);
    }
  });

  render() {
    const {
      isVisible,
      onClose,
      filters,
      setSearchOrderFilter,
      searchOrderFilter,
      toSearch,
    } = this.props;

    const { query } = Router.router;
    return (
      <SlideIn isVisible={isVisible} direction={slideDirection.BOTTOM}>
        <div className={css.wrap}>
          <button className={css.close} onClick={onClose} />
          <div className={css.header}>상세검색</div>
          <div className={css.itemWrap}>
            <SearchCategory />
            <SearchBrand />

            {filters
              ? filters.map(filter => {
                  if (filter.viewType === 'RGB_BUTTON') {
                    return <RgbButton filter={filter} />;
                  } else {
                    return <TextButton filter={filter} />;
                  }
                })
              : null}
          </div>
        </div>
      </SlideIn>
    );
  }
}

export default SearchFilter;
