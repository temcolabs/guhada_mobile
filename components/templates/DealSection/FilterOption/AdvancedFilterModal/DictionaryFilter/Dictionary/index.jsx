import css from './Dictionary.module.scss';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { debounce as _debounce } from 'lodash';
import DictionaryNode from './DictionaryNode';
import { sortFactory, reduceFactory } from './helpers';

const Dictionary = ({
  code,
  initialDataList,
  inputValue,
  currentIds,
  setIds,
}) => {
  /**
   * states
   */
  const scrollRef = useRef();
  const [dataListCopy, setDataListCopy] = useState(initialDataList);
  // const [intersectedIndex, setIntersectedIndex] = useState(null);

  const prop = `name${code}`;
  const alphabets = useMemo(() => {
    const sortedDataList = dataListCopy.sort(sortFactory(code));
    const dictArray = sortedDataList.reduce(reduceFactory[code], []);
    return dictArray;
  }, [dataListCopy, code]);

  /**
   * side effects
   */
  useEffect(() => {
    scrollRef.current.scrollTop = 0;
  }, [code]);

  /**
   * handlers
   */
  const debouncedSetDataListCopy = useCallback(
    _debounce((value) => {
      const upperCasedValue = value.toUpperCase();
      const regex = new RegExp(`^${upperCasedValue}| ${upperCasedValue}`);
      const accessor = code === 'En' ? 'nameEnCap' : prop;
      setDataListCopy(
        initialDataList.filter((item) => regex.test(item[accessor]))
      );
    }, 300),
    [code]
  );

  const handleSetId = (id) => {
    if (!currentIds.includes(id)) {
      const nextIds = [...currentIds, id];
      setIds(nextIds);
    }
  };
  const handleRemoveId = (id) => {
    const idIdx = currentIds.indexOf(id);
    if (idIdx > -1) {
      const nextIds = currentIds
        .slice(0, idIdx)
        .concat(currentIds.slice(idIdx + 1));
      setIds(nextIds);
    }
  };

  /**
   * side effects
   */
  useEffect(() => {
    debouncedSetDataListCopy(inputValue);
  }, [inputValue, debouncedSetDataListCopy]);

  /**
   * render
   */
  return (
    <div className={css['dictionary']}>
      <div ref={scrollRef} className={css['dictionary__list']}>
        {alphabets.map(([index, ...rest]) => (
          <div key={index} className={css['list-set']}>
            <div className={css['list-set__index']}>{index}</div>
            <div className={css['list-set__items']}>
              {rest.map((item) => (
                <DictionaryNode
                  key={item.id}
                  title={item[prop]}
                  id={item.id}
                  isChecked={currentIds.includes(item.id)}
                  handleSetId={handleSetId}
                  handleRemoveId={handleRemoveId}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* <div className={css['dictionary__alphabets']}>
        {alphabets.map(([index]) => (
          <div
            key={index}
            // className={index === intersectedIndex && css['intersected']}
          >
            {index}
          </div>
        ))}
      </div> */}
    </div>
  );
};

Dictionary.propTypes = {
  code: PropTypes.string,
  inputValue: PropTypes.string,
  initialDataList: PropTypes.array,
  currentIds: PropTypes.any,
  setIds: PropTypes.func,
};

export default observer(Dictionary);
