import css from './SearchableTreeFilter.module.scss';
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import cn from 'classnames';
import Dictionary from './Dictionary';
import { sortFactory, enReduceFactory, koReduceFactory } from './helpers';

const SearchableTreeFilter = ({ title, dataList, currentIds, setIds }) => {
  /**
   * states
   */
  const initialDataList = toJS(dataList);
  const [dataListCopy, setDataListCopy] = useState(initialDataList);
  const alphabetsEn = useMemo(() => {
    const enSortFactory = sortFactory('En');
    const sortedDataList = dataListCopy.sort(enSortFactory);
    const dictArray = sortedDataList.reduce(enReduceFactory, []);
    return dictArray;
  }, [dataListCopy]);
  const alphabetsKo = useMemo(() => {
    const koSortFactory = sortFactory('Ko');
    const sortedDataList = dataListCopy.sort(koSortFactory);
    const dictArray = sortedDataList.reduce(koReduceFactory, []);
    return dictArray;
  }, [dataListCopy]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [code, setCode] = useState('En');
  const [alphabets, setAlphabets] = useState(alphabetsEn);

  /**
   * side effects
   */
  useEffect(() => {
    if (code === 'En') {
      setAlphabets(alphabetsEn);
    } else {
      setAlphabets(alphabetsKo);
    }
  }, [code, alphabetsEn, alphabetsKo]);

  useEffect(() => {
    setTimeout(() => {
      setIsFilterOpen(true);
    });
  }, []);

  /**
   * handlers
   */
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    // TODO: serializer
    setInputValue(value);
    setDataListCopy(
      initialDataList.filter((item) => {
        if (code === 'En') {
          return item.nameEn.includes(value);
        }
        return item.nameKo.includes(value);
      })
    );
  };

  const handleSetId = useCallback(
    (id) => {
      if (!currentIds.includes(id)) {
        const nextIds = [...currentIds, id];
        setIds(nextIds);
      }
    },
    [currentIds, setIds]
  );
  const handleRemoveId = useCallback(
    (id) => {
      const idIdx = currentIds.indexOf(id);
      if (idIdx > -1) {
        const nextIds = currentIds
          .slice(0, idIdx)
          .concat(currentIds.slice(idIdx + 1));
        setIds(nextIds);
      }
    },
    [currentIds, setIds]
  );

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
            alphabets={alphabets}
            handleSetId={handleSetId}
            handleRemoveId={handleRemoveId}
          />
        </div>
      )}
    </div>
  );
};

SearchableTreeFilter.propTypes = {
  title: PropTypes.string,
  dataList: PropTypes.any,
  initialIds: PropTypes.any,
  setIds: PropTypes.func,
};

export default memo(SearchableTreeFilter);
