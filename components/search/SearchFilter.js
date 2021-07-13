import { Component } from 'react';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import css from './SearchFilter.module.scss';
import Router from 'next/router';
import RgbButton from './RgbButton';
import TextButton from './TextButton';
import SearchCategory from './SearchCategory';
import SearchBrand from './SearchBrand';
import memoize from 'memoize-one';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import TextButtonCondition from './TextButtonCondition';
import { conditionOption } from 'lib/constant/filter/condition';
import { internationalShippingOptions } from 'lib/constant/filter/internationalShipping';
import { brandNewOptions } from 'lib/constant/filter/brandNew';
import PriceFilter from './PriceFilter';
import ResultSearchFilter from 'components/search/ResultSearchFilter';
@inject('login', 'brands', 'searchitem')
@observer
class SearchFilter extends Component {
  componentDidUpdate(prevProps, prevState) {
    this.setBrandData(this.props.isVisible);
  }
  // isVisible
  setBrandData = memoize((isVisible) => {
    const { brands, searchitem } = this.props;
    if (isVisible === false) {
      //searchitem.initFilter();
      const userId = this.props.login?.loginInfo?.userId;
      brands.getBrands({ userId });
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
            <SearchCategory itemStore={searchitem} />
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
                searchitem.initFilter();
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

export default SearchFilter;
