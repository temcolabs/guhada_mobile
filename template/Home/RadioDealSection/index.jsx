import css from './RadioDealSection.module.scss';
import cn from 'classnames';
import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import DealItems from 'components/organisms/DealItems';
import Spinner from 'components/atoms/Misc/Spinner';

const RadioDealSection = ({
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
            className={cn(selected === name && css['selected'])}
            checked={selected === name}
            onClick={() => setSelected(name)}
          >
            {koName}
          </div>
        ))}
      </div>
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
