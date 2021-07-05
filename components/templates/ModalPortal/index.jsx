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
  transparent = false,
  gutter,
  closeButton = true,
  slide,
}) {
  /**
   * states
   */
  const [modalHeight, setModalHeight] = useState(window.innerHeight);

  /**
   * handlers
   */
  const resizeHandler = () => {
    setModalHeight(window.innerHeight);
  };

  /**
   * side effects
   */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    // document.body.style.position = 'fixed';
    // document.body.style.top = '0';
    // document.body.style.left = '0';
    // document.body.style.right = '0';
    // document.body.style.bottom = '0';
    window.addEventListener('resize', resizeHandler, true);

    return () => {
      document.body.style.overflow = '';
      // document.body.style.position = '';
      // document.body.style.top = '';
      // document.body.style.left = '';
      // document.body.style.right = '';
      // document.body.style.bottom = '';
      window.removeEventListener('resize', resizeHandler, true);
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
        {shade && (
          <div className={css['shade']} onClick={handleClose}>
            {closeButton && <div className="icon close--light" />}
          </div>
        )}
        <div
          style={{ height: `${modalHeight}px` }}
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
          <div
            className={cn(
              css['background'],
              gutter && css['background--gutter']
            )}
          />
          {Children.map(children, (child) =>
            cloneElement(child, { modalHeight })
          )}
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
