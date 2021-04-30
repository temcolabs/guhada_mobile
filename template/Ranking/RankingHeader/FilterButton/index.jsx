import css from './FilterButton.module.scss';
import PropTypes from 'prop-types';
import cn from 'classnames';

const FilterButton = ({ dirty, onClick, children }) => (
  <button
    key={filter}
    className={cn(css['filter__button'], dirty && css['button--dirty'])}
    onClick={onClick}
  >
    {children}
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
