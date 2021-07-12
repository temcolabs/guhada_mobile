import css from './DepthModal.module.scss';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ModalPortal from 'components/templates/ModalPortal';
import DepthMenuSection from './DepthMenuSection';

const DepthModal = ({ item, handleClose, handleCategoryItemClick, height }) => {
  /**
   * states
   */
  const { id, title, children } = item;

  /**
   * render
   */
  return (
    <ModalPortal
      handleClose={handleClose}
      slide={2}
      shade={false}
      closeButton={false}
    >
      <div className={css['modal__header']}>
        <div
          className={cn(css['header__close'], 'icon back')}
          onClick={handleClose}
        />
        {title}
      </div>
      <DepthMenuSection
        id={id}
        children={children}
        handleCategoryItemClick={handleCategoryItemClick}
      />
    </ModalPortal>
  );
};

DepthModal.propTypes = {
  item: PropTypes.object,
  handleClose: PropTypes.func,
  handleCategoryItemClick: PropTypes.func,
};

export default DepthModal;
