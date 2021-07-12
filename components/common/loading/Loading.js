import React from 'react';
import ReactDOM from 'react-dom';
import css from './Loading.module.scss';
import { isBrowser } from 'lib/common/isServer';
import cn from 'classnames';

export const LoadingSpinner = ({ isAbsolute = false }) => {
  return (
    <>
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
      </div>
      {isAbsolute && <div className={css.fixedMask} />}
    </>
  );
};

const LoadingPortal = () => {
  return isBrowser
    ? ReactDOM.createPortal(
        <LoadingSpinner />,
        document.getElementById('__next') ||
          document.getElementsByTagName('body')[0]
      )
    : null;
};

export default LoadingPortal;
