import css from './RadioDealSection.module.scss';
import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import DealItems from 'components/organisms/DealItems';

const RadioDealSection = ({
  header,
  options,
  initialSelected,
  dealObject,
  handleMoreClick,
  count,
  isLazy,
}) => {
  /**
   * states
   */
  const [selected, setSelected] = useState(initialSelected);

  /**
   * render
   */
  return (
    <section className={css['section']}>
      <h2 className={css['section__header']}>{header}</h2>
      <div className={css['section__radio']}>
        {options.map(({ name, koName }) => (
          <div
            key={name}
            className={selected === name && css['selected']}
            checked={selected === name}
            onClick={() => setSelected(name)}
          >
            {koName}
          </div>
        ))}
      </div>
      {options.map(({ name }) => {
        return (
          selected === name && (
            <DealItems
              deals={dealObject[name].slice(0, count)}
              isLazy={isLazy}
            />
          )
        );
      })}
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
  isLazy: PropTypes.bool,
};

export default memo(RadioDealSection);
