import css from './LoadMoreButton.module.scss';
import PropTypes from 'prop-types';

const LoadMoreButton = ({ isLoading, onClick }) => (
  <div className={css['load-more-button']} onClick={onClick}>
    {isLoading ? (
      <div className={css['loading-icon']} />
    ) : (
      <>
        더 보기 <div className={css['plus-icon']} />
      </>
    )}
  </div>
);

LoadMoreButton.propTypes = {
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
};

export default LoadMoreButton;
