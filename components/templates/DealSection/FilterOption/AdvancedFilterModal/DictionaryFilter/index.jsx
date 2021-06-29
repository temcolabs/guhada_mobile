import css from './DictionaryFilter.module.scss';
import { useState, useEffect, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import cn from 'classnames';
import Dictionary from './Dictionary';
import {
  enRegex,
  koRegex,
  findEnLetter,
  findKoLetter,
  sortFactory,
} from './helpers';

const DictionaryFilter = ({ title, dataList, currentIds, setIds }) => {
  /**
   * states
   */
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [code, setCode] = useState('En');

  const initialDataList = useMemo(() => {
    const copiedDataList = toJS(dataList);
    copiedDataList.forEach(
      (item) => (item.nameEnCap = item.nameEn.toUpperCase())
    );
    return copiedDataList;
  }, [dataList]);

  const enInitialDictMap = useMemo(() => {
    const enSortFactory = sortFactory['En'];
    const sortedDataList = initialDataList.sort(enSortFactory);
    const dictMap = new Map([['No.', []]]);

    const callback = (item) => {
      let firstLetter = findEnLetter(item.nameEnCap);
      if (firstLetter) {
        if (!enRegex.test(firstLetter)) {
          firstLetter = 'No.';
        }
        if (dictMap.has(firstLetter)) {
          dictMap.get(firstLetter).push(item);
        } else {
          dictMap.set(firstLetter, [item]);
        }
      }
    };
    sortedDataList.forEach(callback);

    return dictMap;
  }, [initialDataList]);
  const koInitialDictMap = useMemo(() => {
    const koSortFactory = sortFactory['Ko'];
    const sortedDataList = initialDataList.sort(koSortFactory);
    const dictMap = new Map([['No.', []]]);

    const callback = (item) => {
      let firstLetter = findKoLetter(item.nameKo);
      if (firstLetter) {
        if (!koRegex.test(firstLetter)) {
          firstLetter = 'No.';
        }
        if (dictMap.has(firstLetter)) {
          dictMap.get(firstLetter).push(item);
        } else {
          dictMap.set(firstLetter, [item]);
        }
      }
    };
    sortedDataList.forEach(callback);

    return dictMap;
  }, [initialDataList]);

  /**
   * side effects
   */
  useEffect(() => {
    setInputValue('');
  }, [code]);

  /**
   * handlers
   */
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    // TODO: serializer
    setInputValue(value);
  };

  /**
   * render
   */
  return (
    <div className={css['tree']}>
      <div
        className={cn(css['tree__title'], isFilterOpen && css['open'])}
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        {title}
        {/* <span className={css['tree__title__depth']} /> */}
      </div>
      {isFilterOpen && (
        <div className={css['tree__content']}>
          <div className={css['search']}>
            <input
              className={css['search__input']}
              onChange={handleSearchInputChange}
              value={inputValue}
              placeholder="브랜드명을 검색해주세요"
            />
            <div className={css['search__code']}>
              <button
                className={cn(css['code--en'], code === 'En' && css['checked'])}
                onClick={() => setCode('En')}
              >
                ABC
              </button>
              <button
                className={cn(css['code--ko'], code === 'Ko' && css['checked'])}
                onClick={() => setCode('Ko')}
              >
                ㄱㄴㄷ
              </button>
            </div>
          </div>
          {code === 'En' && (
            <Dictionary
              prop={'nameEn'}
              inputValue={inputValue}
              initialDictMap={enInitialDictMap}
              currentIds={currentIds}
              setIds={setIds}
            />
          )}
          {code === 'Ko' && (
            <Dictionary
              prop={'nameKo'}
              inputValue={inputValue}
              initialDictMap={koInitialDictMap}
              currentIds={currentIds}
              setIds={setIds}
            />
          )}
        </div>
      )}
    </div>
  );
};

DictionaryFilter.propTypes = {
  title: PropTypes.string,
  dataList: PropTypes.any,
  initialIds: PropTypes.any,
  setIds: PropTypes.func,
};

export default memo(DictionaryFilter);
