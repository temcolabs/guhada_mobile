import css from './FilterButton.module.scss';
import PropTypes from 'prop-types';
import cn from 'classnames';

const FilterButton = ({ dirty, onClick, children }) => (
  <button
    className={cn(css['filter-button'], dirty && css['button--dirty'])}
    onClick={onClick}
  >
    {children}
    <div className={css['button__dropdown']} />
  </button>
);

FilterButton.propTypes = {
  dirty: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default FilterButton;
