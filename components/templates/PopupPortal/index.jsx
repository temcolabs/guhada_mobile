import css from './PopupPortal.module.scss';
import { useState, useEffect, cloneElement, Children } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import PropTypes from 'prop-types';

function ModalPortal({
  children,
  selectorId = '__next',
  handleClose = () => {},
  closeButton = false,
  shade = true,
  center = true,
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
      <div className={css['popup-portal']}>
        {shade && (
          <div className={css['shade']}>
            {closeButton && (
              <div onClick={handleClose} className="icon close--light" />
            )}
          </div>
        )}
        <div
          style={{ height: `${height}px` }}
          className={cn(css['popup'], center && css['center'])}
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
  handleClose: PropTypes.func,
  closeButton: PropTypes.bool,
  shade: PropTypes.bool,
  center: PropTypes.bool,
};

export default ModalPortal;
