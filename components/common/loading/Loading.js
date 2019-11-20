import React from 'react';
import ReactDOM from 'react-dom';
import css from './Loading.module.scss';
import { isBrowser } from 'childs/lib/common/isServer';

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
    ? ReactDOM.createPortal(
        <Loading />,
        document.getElementById('__next') ||
          document.getElementsByTagName('body')[0]
      )
    : null;
};

export default LoadingPortal;
