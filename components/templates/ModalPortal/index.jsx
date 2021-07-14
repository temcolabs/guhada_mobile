import css from './ModalPortal.module.scss';
import { useState, useEffect, cloneElement, Children } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import PropTypes from 'prop-types';

function ModalPortal({
  children,
  selectorId = '__next',
  handleClose = () => {},
  shade = true,
  gutter,
  closeButton = true,
  slide,
  background = true,
  center = false,
  minHeight = false,
}) {
  /**
   * states
   */
  const [height, setHeight] = useState(window.innerHeight);

  /**
   * handlers
   */
  const resizeHandler = () => {
    setHeight(window.innerHeight);
  };

  /**
   * side effects
   */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.addEventListener('resize', resizeHandler, true);

    return () => {
      handleClose();
      document.body.style.removeProperty('overflow');
      window.removeEventListener('resize', resizeHandler, true);
    };
  }, []);

  /**
   * render
   */
  return (
    typeof document === 'object' &&
    createPortal(
      <div className={cn(css['modal-portal'], minHeight && css['min-height'])}>
        {shade && (
          <div className={css['shade']} onClick={handleClose}>
            {closeButton && <div className="icon close--light" />}
          </div>
        )}
        <div
          style={{ height: `${height}px` }}
          className={cn(
            css['modal'],
            !background && css['transparent'],
            gutter && css['gutter'],
            center && css['center'],
            {
              [css['slideUp']]: slide === 1,
              [css['slideLeft']]: slide === 2,
              [css['slideRight']]: slide === 3,
            }
          )}
        >
          {Children.map(
            children,
            (child) => child && cloneElement(child, { height })
          )}
        </div>
      </div>,
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
  background: PropTypes.bool,
  center: PropTypes.bool,
  minHeight: PropTypes.bool,
};

export default ModalPortal;
