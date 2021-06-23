import css from './RadioDealSection.module.scss';
import cn from 'classnames';
import { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import DealItems from 'components/organisms/DealItems';
import Spinner from 'components/atoms/Misc/Spinner';

const RadioDealSection = ({
  radio = true,
  header,
  options,
  initialSelected,
  dealObject,
  handleMoreClick,
  count,
  isLoading,
  isLazy,
}) => {
  /**
   * states
   */
  const [selected, setSelected] = useState(initialSelected);

  useEffect(() => {
    setSelected(initialSelected);
  }, [initialSelected]);

  /**
   * render
   */
  return (
    <section className={css['section']}>
      <h2 className={css['section__header']}>{header}</h2>
      {radio && (
        <div className={css['section__radio']}>
          {options.map(({ name, koName }) => (
            <div
              key={name}
              className={cn(selected === name && css['selected'])}
              checked={selected === name}
              onClick={() => setSelected(name)}
            >
              {koName}
            </div>
          ))}
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        options.map(
          ({ name }) =>
            selected === name && (
              <DealItems
                key={name}
                deals={dealObject[name].slice(0, count)}
                isLazy={isLazy}
              />
            )
        )
      )}
      <button
        className={css['section__button']}
        onClick={() => handleMoreClick(selected)}
      >
        VIEW MORE
      </button>
    </section>
  );
};

RadioDealSection.propTypes = {
  radio: PropTypes.bool,
  header: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      koName: PropTypes.string,
    })
  ),
  initialSelected: PropTypes.string,
  handleMoreClick: PropTypes.func,
  dealObject: PropTypes.any,
  isLoading: PropTypes.bool,
  isLazy: PropTypes.bool,
};

export default memo(RadioDealSection);
