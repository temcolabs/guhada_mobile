import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import css from './FilterBrand.module.scss';
import cn from 'classnames';
import _ from 'lodash';

@inject('brands', 'searchitem')
@observer
class FilterBrand extends Component {
  state = {
    brandLabel: 'A',
  };

  handleFilterLabel = filter => {
    if (filter === 'en') {
      this.setState({ brandLabel: 'A' });
    } else {
      this.setState({ brandLabel: 'ㄱ' });
    }
  };

  filterBrand = brand => {
    let { searchitem } = this.props;
    searchitem.setFilterBrand(brand);
  };

  render() {
    let { brands, searchitem } = this.props;
    return (
      <>
        <div className={css.headerWrap}>
          <div className={css.input}>
            <input
              type="text"
              placeholder="브랜드명을 검색해주세요."
              onChange={e => brands.searchBrand(e.target.value)}
              value={brands.searchBrandText}
            />
          </div>
          <div className={css.headerAlphabet}>
            <div
              className={cn(css.alphabetItem, {
                [css.selected]: brands.selectedLanguage === 'english',
              })}
              onClick={() => {
                brands.setSelectedLanguage('english');
                this.refs.brandScroll.scrollTo(0, 0);
                this.handleFilterLabel('en');
              }}
            >
              ABC
            </div>
            <div className={css.alphabetLine} />
            <div
              className={cn(css.alphabetItem, {
                [css.selected]: brands.selectedLanguage === 'korean',
              })}
              onClick={() => {
                brands.setSelectedLanguage('korean');
                this.refs.brandScroll.scrollTo(0, 0);
                this.handleFilterLabel('ko');
              }}
            >
              ㄱㄴㄷ
            </div>
          </div>
        </div>
        <div className={cn(css.brandWrap)} ref="brandScroll">
          <div className={css.brand}>
            {brands.selectedLanguage === 'english'
              ? brands.enFilter.map((enbind, enIndex) => {
                  if (
                    _.isNil(brands.enList[enbind]) === false &&
                    brands.enList[enbind].length > 0
                  )
                    return (
                      <Fragment key={enIndex}>
                        <div className={css.languageIndex}>{enbind}</div>
                        {brands.enList[enbind] !== undefined
                          ? brands.enList[enbind].map((brand, i) => {
                              return (
                                <div
                                  key={i}
                                  className={cn(css.languageItem, {
                                    [css.checked]:
                                      searchitem.filterBrand.findIndex(function(
                                        item
                                      ) {
                                        return item.id === brand.id;
                                      }) !== -1,
                                  })}
                                  onClick={() => this.filterBrand(brand)}
                                >
                                  {brand.nameEn}
                                </div>
                              );
                            })
                          : null}
                      </Fragment>
                    );
                  else return null;
                })
              : brands.koFilter.map((kobind, koIndex) => {
                  if (
                    _.isNil(brands.koList[kobind]) === false &&
                    brands.koList[kobind].length > 0
                  )
                    return (
                      <Fragment key={koIndex}>
                        <div className={css.languageIndex}>{kobind}</div>
                        {brands.koList[kobind] !== undefined
                          ? brands.koList[kobind].map((brand, i) => {
                              return (
                                <div
                                  key={i}
                                  className={cn(css.languageItem, {
                                    [css.checked]:
                                      searchitem.filterBrand.findIndex(function(
                                        item
                                      ) {
                                        return item.id === brand.id;
                                      }) !== -1,
                                  })}
                                  onClick={() => this.filterBrand(brand)}
                                >
                                  {brand.nameKo}
                                </div>
                              );
                            })
                          : null}
                      </Fragment>
                    );
                  else return null;
                })}
          </div>
        </div>
      </>
    );
  }
}
export default FilterBrand;
