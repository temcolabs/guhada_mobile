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
import { toJS } from 'mobx';
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

            {toJS(searchitem.filterData)
              ? toJS(searchitem.filterData).map((filter, i) => {
                  if (filter.viewType === 'RGB_BUTTON') {
                    return <RgbButton filter={filter} key={i} />;
                  } else {
                    return <TextButton filter={filter} key={i} />;
                  }
                })
              : null}
          </div>
          <div className={css.button}>
            <button
              className={css.init}
              onClick={() => {
                searchitem.initFilter();
                this.refs.filterScroll.scrollTo(0, 0);
              }}
            >
              초기화
            </button>
            <button className={css.search}>검색결과 보기</button>
          </div>
        </div>
      </SlideIn>
    );
  }
}

export default SearchFilter;
