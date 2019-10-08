import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import css from './Brand.module.scss';
import cn from 'classnames';

@inject('brands', 'searchitem')
@observer
class Brand extends Component {
  state = {
    brandLabel: 'A',
  };

  toScroll = label => {
    const target = document.getElementById('brand' + label); // 요소의 id 값이 target이라 가정
    const clientRect = target.getBoundingClientRect(); // DomRect 구하기 (각종 좌표값이 들어있는 객체)
    const relativeTop = clientRect.top; // Viewport의 시작지점을 기준으로한 상대좌표 Y 값.
    const scrolledTopLength = this.refs.brandScroll.scrollTop; // 스크롤된 길이

    const absoluteTop = relativeTop + scrolledTopLength; // 절대좌표
    this.refs.brandScroll.scrollTo(0, absoluteTop - 185);

    this.setState({ brandLabel: label });
  };

  handleFilterLabel = filter => {
    if (filter === 'en') {
      this.setState({ brandLabel: 'A' });
    } else {
      this.setState({ brandLabel: 'ㄱ' });
    }
  };
  toSearch = id => {
    let { searchitem } = this.props;
    searchitem.toSearch({ brand: id, enter: 'brand' });
  };

  render() {
    let { brands } = this.props;
    return (
      <>
        <div className={css.headerWrap}>
          <div className={css.input}>
            <input
              type="text"
              placeholder="브랜드명을 검색해주세요."
              onChange={e => brands.searchBrand(e.target.value)}
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
        <div
          className={cn(css.brandWrap, {
            [css.fromHeaderMenu]: this.props.fromHeader === true,
          })}
          ref="brandScroll"
        >
          <div className={css.brand}>
            {brands.selectedLanguage === 'english'
              ? brands.enFilter.map((enbind, enIndex) => {
                  return (
                    <Fragment key={enIndex}>
                      <div id={'brand' + enbind} className={css.languageIndex}>
                        {enbind}
                      </div>
                      {brands.enList[enbind] !== undefined
                        ? brands.enList[enbind].map((brand, i) => {
                            return (
                              <div
                                key={i}
                                className={css.languageItem}
                                onClick={() => this.toSearch(brand.id)}
                              >
                                {brand.nameEn}
                              </div>
                            );
                          })
                        : null}
                    </Fragment>
                  );
                })
              : brands.koFilter.map((kobind, koIndex) => {
                  return (
                    <Fragment key={koIndex}>
                      <div id={'brand' + kobind} className={css.languageIndex}>
                        {kobind}
                      </div>
                      {brands.koList[kobind] !== undefined
                        ? brands.koList[kobind].map((brand, i) => {
                            return (
                              <div
                                key={i}
                                className={css.languageItem}
                                onClick={() => this.toSearch(brand.id)}
                              >
                                {brand.nameKo}
                              </div>
                            );
                          })
                        : null}
                    </Fragment>
                  );
                })}
          </div>
        </div>
        <div className={css.filter}>
          {brands.selectedLanguage === 'english'
            ? brands.enFilter.map((en, enIndex) => {
                return (
                  <div
                    className={cn(css.item, {
                      [css.selected]: this.state.brandLabel === en,
                    })}
                    key={enIndex}
                    onClick={() => this.toScroll(en)}
                  >
                    {en}
                  </div>
                );
              })
            : brands.koFilter.map((ko, koIndex) => {
                return (
                  <div
                    className={cn(css.item, {
                      [css.selected]: this.state.brandLabel === ko,
                    })}
                    key={koIndex}
                    onClick={() => this.toScroll(ko)}
                  >
                    {ko}
                  </div>
                );
              })}
        </div>
      </>
    );
  }
}
export default Brand;
