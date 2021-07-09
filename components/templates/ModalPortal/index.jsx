import css from './ModalPortal.module.scss';
import { useState, useEffect, useRef, cloneElement, Children } from 'react';
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
}) {
  /**
   * states
   */
  const [height, setHeight] = useState(window.innerHeight);
  const historyRef = useRef();

  /**
   * handlers
   */
  const resizeHandler = () => {
    setHeight(window.innerHeight);
  };

  const popStateHandler = (e) => {
    historyRef.current = null;
    handleClose();
    window.removeEventListener('popstate', popStateHandler);
  };

  /**
   * side effects
   */
  useEffect(() => {
    historyRef.current = JSON.stringify(window.history.state);
    window.history.pushState(
      JSON.parse(historyRef.current),
      document.title,
      '#m'
    );

    document.body.style.overflow = 'hidden';
    window.addEventListener('popstate', popStateHandler);
    window.addEventListener('resize', resizeHandler, true);

    return () => {
      if (historyRef.current) {
        window.history.back();
        historyRef.current = null;
      }

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
      <div className={css['modal-portal']}>
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
};

export default ModalPortal;
