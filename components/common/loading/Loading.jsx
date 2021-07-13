import { createPortal } from 'react-dom';
import css from './Loading.module.scss';
import cn from 'classnames';

export const LoadingSpinner = ({ isAbsolute = false }) => (
  <div className={cn(css.wrap, { [css.isAbsolute]: isAbsolute })}>
    <div className={css.loader}>
      <div className={css.box} />
      <div className={css.box} />
      <div className={css.box} />
      <div className={css.box} />
      <div className={css.box} />
      <div className={css.box} />
      <div className={css.box} />
      <div className={css.box} />
      <div className={css.box} />
      <div className={css.box} />
      <div className={css.box} />
      <div className={css.box} />
    </div>
    {isAbsolute && <div className={css.fixedMask} />}
  </div>
);

const LoadingPortal = ({ selectorId = '__next' }) => {
  return (
    typeof document === 'object' &&
    createPortal(<LoadingSpinner />, document.getElementById(selectorId))
  );
};

export default LoadingPortal;
