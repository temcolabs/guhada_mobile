import css from './PriceFilter.module.scss';
import { useState, memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const parseValue = (value) => {
  let number = value || 0;
  if (!number || !isFinite(number)) {
    return 0;
  }
  if (number.length > 10) {
    number = number.slice(0, 10);
  }
  if (number !== '0') {
    number = number.replace(/^0+/, '');
  }
  return parseInt(number);
};

const PriceFilter = ({ title, mapObject, isInitial, handleSetPriceRange }) => {
  /**
   * states
   */
  const [selectedRange, setSelectedRange] = useState(0);
  const [minPriceValue, setMinPriceValue] = useState(0);
  const [maxPriceValue, setMaxPriceValue] = useState(0);

  /**
   * handlers
   */
  const handleSubmitPriceRange = () => {
    handleSetPriceRange(minPriceValue, maxPriceValue);
  };

  /**
   * side effects
   */
  useEffect(() => {
    if (isInitial) {
      handleSetMaxPriceValue(0, 0);
    }
  }, [isInitial]);

  useEffect(() => {
    handleSubmitPriceRange();
  }, [minPriceValue, maxPriceValue]);

  const handleSetMaxPriceValue = (value, idx) => {
    setMinPriceValue(0);
    setMaxPriceValue(value);
    setSelectedRange(idx);
    handleSetPriceRange(0, value);
  };
  const handleMinPriceValueChange = (e) => {
    const value = parseValue(e.target.value);
    if (value > maxPriceValue) {
      setMaxPriceValue(value);
    }
    setMinPriceValue(value);
    if (selectedRange >= 0) {
      setSelectedRange(-1);
    }
  };
  const handleMaxPriceValueChange = (e) => {
    const value = parseValue(e.target.value);
    if (value < maxPriceValue) {
      setMaxPriceValue(value);
    }
    setMaxPriceValue(value);
    if (selectedRange >= 0) {
      setSelectedRange(-1);
    }
  };

  /**
   * render
   */
  return (
    <div className={css['selection']}>
      <div className={css['selection__title']}>{title}</div>
      <div className={css['selection__items']}>
        {Array.from(mapObject).map(([key, value], idx) => (
          <div
            key={key}
            className={css['item']}
            onClick={() => handleSetMaxPriceValue(value, idx)}
          >
            <span
              className={cn(
                css['item__check'],
                idx === selectedRange && css['checked']
              )}
            />
            {key}
          </div>
        ))}
      </div>
      <div className={css['selection__range']}>
        <input
          type="number"
          placeholder={'최소가격'}
          value={minPriceValue ? minPriceValue : ''}
          onChange={handleMinPriceValueChange}
        />
        <span>~</span>
        <input
          type="number"
          placeholder={'최대가격'}
          value={maxPriceValue ? maxPriceValue : ''}
          onChange={handleMaxPriceValueChange}
        />
        <span>원</span>
        {/* <button onClick={handleSubmitPriceRange}>적용</button> */}
      </div>
    </div>
  );
};

PriceFilter.propTypes = {
  title: PropTypes.string,
  mapObject: PropTypes.instanceOf(Map),
  handleSetPriceRange: PropTypes.func,
};

export default memo(PriceFilter);
