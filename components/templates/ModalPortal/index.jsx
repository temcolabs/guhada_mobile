import css from './ModalPortal.module.scss';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import PropTypes from 'prop-types';

function ModalPortal({
  children,
  selectorId = 'modal-portal',
  handleClose = () => {},
  transparent = false,
  gutter,
  closeButton = true,
  slide,
}) {
  /**
   * side effects
   */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
      handleClose();
    };
  }, []);

  /**
   * render
   */
  return (
    typeof document === 'object' &&
    createPortal(
      <>
        <div
          className={cn(css['shade'], closeButton && css['close-button'])}
          onClick={handleClose}
        />
        <div
          className={cn(
            css['modal'],
            transparent && css['transparent'],
            gutter && css['gutter'],
            {
              [css['slideUp']]: slide === 1,
              [css['slideLeft']]: slide === 2,
              [css['slideRight']]: slide === 3,
            }
          )}
        >
          {children}
        </div>
      </>,
      document.getElementById(selectorId)
    )
  );
}

ModalPortal.propTypes = {
  selectorId: PropTypes.string,
  style: PropTypes.object,
  gutter: PropTypes.bool,
  closeButton: PropTypes.bool,
  slide: PropTypes.number,
};

export default ModalPortal;
