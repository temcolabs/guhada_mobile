import React from 'react';
import ReactDOM from 'react-dom';
import css from './Loading.module.scss';
import { isBrowser } from 'lib/isServer';

const Loading = () => {
  return (
    <div className={css.wrap}>
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
  );
};

const LoadingPortal = () => {
  return isBrowser
    ? ReactDOM.createPortal(<Loading />, document.getElementById('__next'))
    : null;
};

export default LoadingPortal;
