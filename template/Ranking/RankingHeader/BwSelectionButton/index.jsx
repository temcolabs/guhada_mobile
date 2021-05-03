import css from './BwSelectionButton.module.scss';
import PropTypes from 'prop-types';
import cn from 'classnames';

const BwSelectionButton = ({
  leftSelected,
  leftOnClick,
  leftChildren,
  rightSelected,
  rightOnClick,
  rightChildren,
}) => (
  <div className={css['bw-selection-button']}>
    <button
      className={cn(
        css['selection-button'],
        css['button--left'],
        leftSelected && css['button--selected']
      )}
      onClick={leftOnClick}
    >
      {leftChildren}
    </button>
    <button
      className={cn(
        css['selection-button'],
        css['button--right'],
        rightSelected && css['button--selected']
      )}
      onClick={rightOnClick}
    >
      {rightChildren}
    </button>
  </div>
);

BwSelectionButton.propTypes = {
  leftSelected: PropTypes.bool,
  leftOnClick: PropTypes.func,
  leftChildren: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  rightSelected: PropTypes.bool,
  rightOnClick: PropTypes.func,
  rightChildren: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default BwSelectionButton;
