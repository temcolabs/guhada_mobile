import css from './Dictionary.module.scss';
import { useState, useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useMountAndUpdate } from 'lib/hooks';
import DictionaryNode from './DictionaryNode';

const Dictionary = ({
  prop,
  inputValue,
  initialDictMap,
  currentIds,
  setIds,
}) => {
  /**
   * states
   */
  const scrollRef = useRef();
  const [dictMap, setDictMap] = useState(initialDictMap);
  // const [intersectedIndex, setIntersectedIndex] = useState(null);

  /**
   * handlers
   */
  const debouncedSetDictMap = _.debounce((value) => {
    const upperCasedValue = value.toUpperCase();
    const regex = new RegExp(`^${upperCasedValue}| ${upperCasedValue}`);
    const accessor = prop === 'nameEn' ? 'nameEnCap' : prop;

    const filteredDictMap = new Map(
      Array.from(initialDictMap).map(([letter, items]) => {
        return [letter, items.filter((item) => regex.test(item[accessor]))];
      })
    );

    setDictMap(filteredDictMap);
  }, 300);

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
    scrollRef.current.scrollTop = 0;
  }, [prop]);

  useMountAndUpdate(
    () => {},
    () => {
      debouncedSetDictMap(inputValue);
    },
    [inputValue]
  );

  /**
   * render
   */
  return (
    <div className={css['dictionary']}>
      <div ref={scrollRef} className={css['dictionary__list']}>
        {Array.from(dictMap).map(([letter, items]) => {
          if (items.length > 0) {
            return (
              <div key={letter} className={css['list-set']}>
                <div className={css['list-set__index']}>{letter}</div>
                <div className={css['list-set__items']}>
                  {items.map((item) => (
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
            );
          }
          return null;
        })}
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
  initialDictMap: PropTypes.instanceOf(Map),
  currentIds: PropTypes.any,
  setIds: PropTypes.func,
};

export default memo(Dictionary);
