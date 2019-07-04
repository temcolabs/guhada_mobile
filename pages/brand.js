import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import css from './brand.module.scss';
import cn from 'classnames';

@inject('brands', 'searchitem')
@observer
class brand extends Component {
  toScroll = en => {
    const target = document.getElementById('brand' + en); // 요소의 id 값이 target이라 가정
    const clientRect = target.getBoundingClientRect(); // DomRect 구하기 (각종 좌표값이 들어있는 객체)
    const relativeTop = clientRect.top; // Viewport의 시작지점을 기준으로한 상대좌표 Y 값.
    const scrolledTopLength = window.pageYOffset; // 스크롤된 길이
    const absoluteTop = scrolledTopLength + relativeTop; // 절대좌표

    window.scrollTo(0, absoluteTop - 70);
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
            />
          </div>
          <div className={css.headerAlphabet}>
            <div
              className={cn(css.alphabetItem, {
                [css.selected]: brands.selectedLanguage === 'english',
              })}
              onClick={() => (
                brands.setSelectedLanguage('english'), window.scrollTo(0, 0)
              )}
            >
              ABC
            </div>
            <div className={css.alphabetLine}></div>
            <div
              className={cn(css.alphabetItem, {
                [css.selected]: brands.selectedLanguage === 'korean',
              })}
              onClick={() => (
                brands.setSelectedLanguage('korean'), window.scrollTo(0, 0)
              )}
            >
              ㄱㄴㄷ
            </div>
          </div>
        </div>
        <div className={css.brandWrap}>
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
                                onClick={() =>
                                  searchitem.toSearch(
                                    '',
                                    brand.id,
                                    1,
                                    20,
                                    'DATE',
                                    '',
                                    '',
                                    'brand'
                                  )
                                }
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
                                onClick={() =>
                                  searchitem.toSearch(
                                    '',
                                    brand.id,
                                    1,
                                    20,
                                    'DATE',
                                    '',
                                    '',
                                    'brand'
                                  )
                                }
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
          <div className={css.filter}>
            {brands.selectedLanguage === 'english'
              ? brands.enFilter.map((en, enIndex) => {
                  return (
                    <>
                      <div
                        className={css.item}
                        key={enIndex}
                        onClick={() => this.toScroll(en)}
                      >
                        {en}
                      </div>
                      <div className={css.filterDot}></div>
                    </>
                  );
                })
              : brands.koFilter.map((ko, koIndex) => {
                  return (
                    <>
                      <div
                        className={css.item}
                        key={koIndex}
                        onClick={() => this.toScroll(ko)}
                      >
                        {ko}
                      </div>
                      <div className={css.filterDot}></div>
                    </>
                  );
                })}
          </div>
        </div>
      </>
    );
  }
}

export default brand;
