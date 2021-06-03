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

const PriceFilter = ({
  title,
  mapObject,
  minPrice,
  maxPrice,
  handleSetMinPrice,
  handleSetMaxPrice,
  handleSetPriceRange,
}) => {
  /**
   * states
   */
  const [selectedOption, setSelectedOption] = useState(0);

  /**
   * side effects
   */
  useEffect(() => {
    if (minPrice === 0 && maxPrice === 0) {
      setSelectedOption(0);
    }
  }, [minPrice, maxPrice]);

  /**
   * handlers
   */
  const handleMinPriceChange = (e) => {
    const price = parseValue(e.target.value);
    if (price > maxPrice) {
      handleSetPriceRange(price, price);
    } else {
      handleSetMinPrice(price);
    }
    if (selectedOption > -1) {
      setSelectedOption(-1);
    }
  };
  const handleMaxPriceChange = (e) => {
    const price = parseValue(e.target.value);
    handleSetMaxPrice(price);
    if (selectedOption > -1) {
      setSelectedOption(-1);
    }
  };

  const handleSetPriceOption = (value, idx) => {
    handleSetPriceRange(0, value);
    setSelectedOption(idx);
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
            onClick={() => handleSetPriceOption(value, idx)}
          >
            <span
              className={cn(
                css['item__check'],
                idx === selectedOption && css['checked']
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
          value={minPrice ? minPrice : ''}
          onChange={handleMinPriceChange}
        />
        <span>~</span>
        <input
          type="number"
          placeholder={'최대가격'}
          value={maxPrice ? maxPrice : ''}
          onChange={handleMaxPriceChange}
        />
        <span>원</span>
        {/* <button onClick={() => {})}>적용</button> */}
      </div>
    </div>
  );
};

PriceFilter.propTypes = {
  title: PropTypes.string,
  mapObject: PropTypes.instanceOf(Map),
  minPrice: PropTypes.number,
  maxPrice: PropTypes.number,
  handleSetMinPrice: PropTypes.func,
  handleSetMaxPrice: PropTypes.func,
  handleSetPriceRange: PropTypes.func,
};

export default memo(PriceFilter);
