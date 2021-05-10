import css from './GiftHeader.module.scss';
import PropTypes from 'prop-types';
import cn from 'classnames';

const GiftHeader = ({ handleOpenModal }) => (
  <div className={css['gift__header']}>
    <div className={cn(css['header__banner'], css['banner--main'])} />
    <div
      className={cn(css['header__banner'], css['banner--sub'])}
      onClick={handleOpenModal}
    />
  </div>
);

GiftHeader.propTypes = {
  handleOpenModal: PropTypes.func,
};

export default GiftHeader;
