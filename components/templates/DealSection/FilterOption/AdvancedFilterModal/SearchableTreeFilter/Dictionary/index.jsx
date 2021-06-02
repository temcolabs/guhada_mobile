import css from './Dictionary.module.scss';
import { useState, useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import DictionaryNode from './DictionaryNode';

const Dictionary = ({ code, alphabets, handleSetId, handleRemoveId }) => {
  /**
   * states
   */
  const [intersectedIndex, setIntersectedIndex] = useState(alphabets[0][0]);
  const scrollRef = useRef();
  const prop = `name${code}`;

  /**
   * side effects
   */
  useEffect(() => {
    scrollRef.current.scrollTop = 0;
  }, [code]);

  /**
   * render
   */
  return (
    <div className={css['dictionary']}>
      <div ref={scrollRef} className={css['dictionary__list']}>
        {alphabets.map(([index, ...rest]) => (
          <div className={css['list-set']}>
            <div className={css['list-set__index']}>{index}</div>
            <div className={css['list-set__items']}>
              {rest.map((item) => (
                <DictionaryNode
                  key={item.id}
                  title={item[prop]}
                  id={item.id}
                  handleSetId={handleSetId}
                  handleRemoveId={handleRemoveId}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={css['dictionary__alphabets']}>
        {alphabets.map(([index]) => (
          <div className={index === intersectedIndex && css['intersected']}>
            {index}
          </div>
        ))}
      </div>
    </div>
  );
};

Dictionary.propTypes = {
  code: PropTypes.string,
  alphabets: PropTypes.array,
  handleSetId: PropTypes.func,
  handleRemoveId: PropTypes.func,
};

export default memo(Dictionary);
