import css from './DictionaryFilter.module.scss';
import { useState, useEffect, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import cn from 'classnames';
import Dictionary from './Dictionary';

const DictionaryFilter = ({ title, dataList, currentIds, setIds }) => {
  /**
   * states
   */
  const initialDataList = useMemo(() => {
    const copiedDataList = toJS(dataList);
    copiedDataList.forEach(
      (item) => (item.nameEnCap = item.nameEn.toUpperCase())
    );
    return copiedDataList;
  }, [dataList]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [code, setCode] = useState('En');

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
          <Dictionary
            code={code}
            inputValue={inputValue}
            initialDataList={initialDataList}
            currentIds={currentIds}
            setIds={setIds}
          />
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
