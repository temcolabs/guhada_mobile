import React, { Fragment, useRef, useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import css from './Brand.module.scss';
import cn from 'classnames';
import { isNil, debounce } from 'lodash';
import { sendBackToLogin } from 'childs/lib/router';
import useStores from 'stores/useStores';
import Image from 'components/atoms/Image';

const IMAGE_PATH = {
  starOn: '/static/icon/gnb_star_icon.png',
  starOff: '/static/icon/gnb_greystar_icon.png',
};

/**
 * 함수형, 최신 Brand component
 * @param {Boolean} isVisible
 * @param {Boolean} fromHeader
 * @param {Function} onClose
 * @param {Function} onCloseMenu
 * @returns
 */
function _Brand({ isVisible, fromHeader, onClose, onCloseMenu }) {
  const brandScrollRef = useRef(null); // Brand section
  const brandRef = useRef(null); // Brand items

  const [brandLabel, setBrandLabel] = useState('A'); // Current brand label
  const [isFavorite, setIsFavorite] = useState(false); // Favorite menu Active / InActive\
  const { login, brands, searchitem } = useStores();

  const userId = login?.loginInfo?.userId;

  /** Initialized brands **/
  useEffect(() => brands.getBrands({ userId }), []);

  /** Changing filter label listener ( Active / InActive ) **/
  useEffect(
    () =>
      isVisible
        ? brandScrollRef.current.addEventListener('scroll', toScrollFilterLabel)
        : brandScrollRef.current.removeEventListener(
            'scroll',
            toScrollFilterLabel
          ),
    [isVisible]
  );

  /**
   * Clicked filter item
   * @param {String} label, A,B,C...
   */
  const handleFilterItem = (label) => {
    const target =
      fromHeader === true
        ? document.getElementById(`brand${label}fromHeader`)
        : document.getElementById(`brand${label}`); // 요소의 id 값이 target이라 가정

    const headerHeight = 60;
    const brandHeader = 70;
    const _fromHeader = fromHeader === true ? 0 : 60;

    if (isNil(target) === false) {
      const clientRect = target.getBoundingClientRect(); // DomRect 구하기 (각종 좌표값이 들어있는 객체)
      const relativeTop = clientRect.top; // Viewport의 시작지점을 기준으로한 상대좌표 Y 값.
      const scrolledTopLength = brandScrollRef.current.scrollTop; // 스크롤된 길이
      const absoluteTop = relativeTop + scrolledTopLength; // 절대좌표
      let marginHeight = headerHeight + brandHeader + _fromHeader;
      brandScrollRef.current.scrollTo(0, absoluteTop - marginHeight);
    }
    setBrandLabel(label);
  };

  /**
   * Changed brand language
   * @param {String} lang, 'en', 'ko'
   */
  const handleLanguageMenu = (lang = 'en') => {
    const langauge =
      (lang === 'en' && 'english') || (lang === 'ko' && 'korean') || 'english';
    brands.setSelectedLanguage(langauge);
    brands.setFilterFavorite(isFavorite);
    brandScrollRef.current.scrollTo(0, 0);
    toFilterLabel(lang);
  };

  /**
   * Changed brand favorite menu status
   * @param {Boolean} isFavorite
   */
  const handleFavoriteMenu = (isFavorite) => {
    brands.setFilterFavorite(isFavorite);
    brandScrollRef.current.scrollTo(0, 0);
    setIsFavorite(isFavorite);
  };

  /**
   * Changed brand item favorite status
   * @param {Number} brandId
   * @param {Boolean} isFavorite
   */
  const handleFavoriteItem = async ({ brandId, isFavorite }) => {
    if (userId) {
      const resultCode = isFavorite
        ? await brands.deleteUserBrandFavorite(userId, brandId)
        : await brands.createUserBrandFavorite(userId, brandId);

      if (resultCode === 200) await brands.getBrands({ userId });
    } else sendBackToLogin();
  };

  const toSearch = (id) => {
    onClose();
    if (!!fromHeader) onCloseMenu();
    searchitem.toSearch({ brand: id, enter: 'brand' });
  };

  const toFilterLabel = (filter) =>
    filter === 'en' ? setBrandLabel('A') : setBrandLabel('ㄱ');

  /**
   * [Listener] Scrolling brand section
   * Case1 : target < scrollTop < nextTarget
   * Case2 : scrollTop < target
   * Case3 : nextTarget < scrollTop
   */
  const toScrollFilterLabel = debounce(
    (e) =>
      setBrandLabel((prevLabel) => {
        const curLabel = `brand${prevLabel}`;
        const scrollTop = brandScrollRef.current.scrollTop;
        const targetList = [].filter.call(
          brandRef.current.childNodes,
          (e) => e.id
        );
        const targetIdx = targetList.findIndex((e) => e.id === curLabel);
        if (targetIdx !== -1) {
          const curTop = targetList[targetIdx].offsetTop;
          const nextIdx =
            targetIdx + 1 > targetList.length - 1
              ? targetList.length - 1
              : targetIdx + 1;
          const nextTarget = targetList[nextIdx];

          if (curTop < scrollTop && nextTarget.offsetTop > scrollTop) {
            return prevLabel;
          } else {
            if (curTop > scrollTop) {
              const prevIdx = targetIdx - 1 > 0 ? targetIdx - 1 : 0;
              const prevTarget = targetList[prevIdx];
              return prevTarget.id?.replace('brand', '');
            } else {
              return nextTarget.id?.replace('brand', '');
            }
          }
        } else return prevLabel;
      }),
    50
  );

  return (
    <>
      <div className={css.brandWrap}>
        {/* Header Section */}
        <div className={css.headerSection}>
          <div className={css.input}>
            <input
              type="text"
              placeholder="브랜드명을 검색해주세요."
              onChange={(e) => brands.searchBrand(e.target.value, isFavorite)}
              value={brands.searchBrandText}
            />
          </div>
          <div className={css.headerAlphabet}>
            <div
              className={cn(css.alphabetItem, {
                [css.selected]: brands.selectedLanguage === 'english',
              })}
              onClick={() => handleLanguageMenu('en')}
            >
              ABC
            </div>
            <div className={css.alphabetLine} />
            <div
              className={cn(css.alphabetItem, {
                [css.selected]: brands.selectedLanguage === 'korean',
              })}
              onClick={() => handleLanguageMenu('ko')}
            >
              ㄱㄴㄷ
            </div>
            <div
              className={cn(css.favoriteItem)}
              onClick={() => handleFavoriteMenu(!isFavorite)}
            >
              <Image
                src={isFavorite ? IMAGE_PATH.starOn : IMAGE_PATH.starOff}
                width={'18px'}
                height={'18px'}
              />
            </div>
          </div>
        </div>

        {/* Brand Section */}
        <div
          className={cn(css.brandSection, {
            [css.fromHeaderMenu]: fromHeader === true,
          })}
          ref={brandScrollRef}
        >
          <div className={css.brand} ref={brandRef}>
            {brands.selectedLanguage === 'english'
              ? brands.enFilter.map((enbind, enIndex) => {
                  if (
                    isNil(brands.enList[enbind]) === false &&
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
                                  onClick={() => toSearch(brand.id)}
                                >
                                  <span
                                    className={css.favoriteBtn}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleFavoriteItem({
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
                    isNil(brands.koList[kobind]) === false &&
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
                                  onClick={() => toSearch(brand.id)}
                                >
                                  <span
                                    className={css.favoriteBtn}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleFavoriteItem({
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
                        [css.selected]: brandLabel === en,
                      })}
                      key={enIndex}
                      onClick={() => handleFilterItem(`${en}`)}
                    >
                      {en}
                    </div>
                  );
                })
              : brands.koFilter.map((ko, koIndex) => {
                  return (
                    <div
                      className={cn(css.item, {
                        [css.selected]: brandLabel === ko,
                      })}
                      key={koIndex}
                      onClick={() => handleFilterItem(`${ko}`)}
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

export default observer(_Brand);
