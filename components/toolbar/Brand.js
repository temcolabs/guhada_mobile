import React, { createRef, Component, Fragment } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import css from './Brand.module.scss';
import cn from 'classnames';
import _ from 'lodash';

import Image from 'components/atoms/Image';

const IMAGE_PATH = {
  starOn: '/static/icon/gnb_star_icon.png',
  starOff: '/static/icon/gnb_greystar_icon.png',
};

@inject('login', 'brands', 'searchitem')
@observer
class Brand extends Component {
  state = {
    brandLabel: 'A',
    isFavorite: false,
  };

  componentDidMount() {
    const { brands } = this.props;
    const userId = this.props.login?.loginInfo?.userId;
    brands.getBrands({ userId });
  }

  toScroll = (label) => {
    const target =
      this.props.fromHeader === true
        ? document.getElementById(`brand${label}fromHeader`)
        : document.getElementById(`brand${label}`); // 요소의 id 값이 target이라 가정

    const headerHeight = 60;
    const brandHeader = 70;
    const fromHeader = this.props.fromHeader === true ? 0 : 60;

    if (_.isNil(target) === false) {
      const clientRect = target.getBoundingClientRect(); // DomRect 구하기 (각종 좌표값이 들어있는 객체)
      const relativeTop = clientRect.top; // Viewport의 시작지점을 기준으로한 상대좌표 Y 값.
      const scrolledTopLength = this.refs.brandScroll.scrollTop; // 스크롤된 길이
      const absoluteTop = relativeTop + scrolledTopLength; // 절대좌표
      let marginHeight = headerHeight + brandHeader + fromHeader;
      this.refs.brandScroll.scrollTo(0, absoluteTop - marginHeight);
    }
    this.setState({ brandLabel: label });
  };

  handleFilterLabel = (filter) => {
    if (filter === 'en') {
      this.setState({ brandLabel: 'A' });
    } else {
      this.setState({ brandLabel: 'ㄱ' });
    }
  };

  /**
   * 브랜드 > 언어 선택
   * @param {String} lang, 'en', 'ko'
   */
  handleLanguageMenu = (lang = 'en') => {
    const langauge =
      (lang === 'en' && 'english') || (lang === 'ko' && 'korean') || 'english';
    this.props.brands.setSelectedLanguage(langauge);
    this.refs.brandScroll.scrollTo(0, 0);
    this.handleFilterLabel(lang);
    this.handleFavoriteMenu(false);
  };

  /**
   * 즐겨찾기 카테고리 on / off
   * @param {Boolean} isFavorite
   */
  handleFavoriteMenu = (isFavorite) => {
    if (isFavorite) {
      this.props.brands.setSelectedLanguage('favorite');
    }
    this.setState({ ...this.state, isFavorite });
  };

  /**
   * 즐겨찾기 on / off
   * @param {Number} brandId
   * @param {Boolean} isFavorite
   */
  handleFavoriteItem = async ({ brandId, isFavorite }) => {
    const { brands, login } = this.props;
    const userId = login?.loginInfo?.userId;

    if (userId) {
      const resultCode = isFavorite
        ? await brands.deleteUserBrandFavorite(userId, brandId)
        : await brands.createUserBrandFavorite(userId, brandId);

      if (resultCode === 200) {
        const index = brands.selectedBrands.findIndex((o) => o.id === brandId);
        if (index !== -1) {
          let selectedBrands = brands.selectedBrands;
          selectedBrands[index].isFavorite = !isFavorite;
          brands.setBrands(brands.brands, selectedBrands);
        }
      }
    }
  };

  toSearch = (id) => {
    let { searchitem, onClose, fromHeader, onCloseMenu } = this.props;
    onClose();
    if (!!fromHeader) onCloseMenu();

    searchitem.toSearch({ brand: id, enter: 'brand' });
  };

  render() {
    let { brands, fromHeader } = this.props;

    return (
      <>
        <div className={css.brandWrap}>
          {/* Header Section */}
          <div className={css.headerSection}>
            <div className={css.input}>
              <input
                type="text"
                placeholder="브랜드명을 검색해주세요."
                onChange={(e) => brands.searchBrand(e.target.value)}
                value={brands.searchBrandText}
              />
            </div>
            <div className={css.headerAlphabet}>
              <div
                className={cn(css.alphabetItem, {
                  [css.selected]: brands.selectedLanguage === 'english',
                })}
                onClick={() => this.handleLanguageMenu('en')}
              >
                ABC
              </div>
              <div className={css.alphabetLine} />
              <div
                className={cn(css.alphabetItem, {
                  [css.selected]: brands.selectedLanguage === 'korean',
                })}
                onClick={() => this.handleLanguageMenu('ko')}
              >
                ㄱㄴㄷ
              </div>
              <div
                className={cn(css.favoriteItem)}
                onClick={() => this.handleFavoriteMenu(!this.state.isFavorite)}
              >
                <Image
                  src={
                    this.state.isFavorite
                      ? IMAGE_PATH.starOn
                      : IMAGE_PATH.starOff
                  }
                  width={'18px'}
                  height={'18px'}
                />
              </div>
            </div>
          </div>

          {/* Brand Section */}
          <div
            className={cn(css.brandSection, {
              [css.fromHeaderMenu]: this.props.fromHeader === true,
            })}
            ref="brandScroll"
          >
            <div className={css.brand}>
              {brands.selectedLanguage === 'english'
                ? brands.enFilter.map((enbind, enIndex) => {
                    if (
                      _.isNil(brands.enList[enbind]) === false &&
                      brands.enList[enbind].length > 0
                    )
                      return (
                        <Fragment key={enIndex}>
                          <div
                            id={`brand${enbind}${
                              fromHeader === true ? 'fromHeader' : ''
                            }`}
                            className={css.languageIndex}
                          >
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
                                    <span
                                      className={css.favoriteBtn}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        this.handleFavoriteItem({
                                          brandId: brand.id,
                                          isFavorite: brand.isFavorite,
                                        });
                                      }}
                                    >
                                      <Image
                                        src={
                                          brand.isFavorite
                                            ? IMAGE_PATH.starOn
                                            : IMAGE_PATH.starOff
                                        }
                                        width={'14px'}
                                        height={'13px'}
                                        size={'contain'}
                                      />
                                    </span>
                                    <span>{brand.nameEn}</span>
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
                          <div
                            id={`brand${kobind}${
                              fromHeader === true ? 'fromHeader' : ''
                            }`}
                            className={css.languageIndex}
                          >
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
                                    <span
                                      className={css.favoriteBtn}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        this.handleFavoriteItem({
                                          brandId: brand.id,
                                          isFavorite: brand.isFavorite,
                                        });
                                      }}
                                    >
                                      <Image
                                        src={
                                          brand.isFavorite
                                            ? IMAGE_PATH.starOn
                                            : IMAGE_PATH.starOff
                                        }
                                        width={'14px'}
                                        height={'13px'}
                                        size={'contain'}
                                      />
                                    </span>
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

          {/* Filter Section */}
          <div className={css.filterSection}>
            <div className={css.filter}>
              {brands.selectedLanguage === 'english'
                ? brands.enFilter.map((en, enIndex) => {
                    return (
                      <div
                        className={cn(css.item, {
                          [css.selected]: this.state.brandLabel === en,
                        })}
                        key={enIndex}
                        onClick={() => this.toScroll(`${en}`)}
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
                        onClick={() => this.toScroll(`${ko}`)}
                      >
                        {ko}
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
        {/* <div className={css.filter}>
          {brands.selectedLanguage === 'english'
            ? brands.enFilter.map((en, enIndex) => {
                return (
                  <div
                    className={cn(css.item, {
                      [css.selected]: this.state.brandLabel === en,
                    })}
                    key={enIndex}
                    onClick={() => this.toScroll(`${en}`)}
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
                    onClick={() => this.toScroll(`${ko}`)}
                  >
                    {ko}
                  </div>
                );
              })}
        </div> */}
      </>
    );
  }
}
export default Brand;
