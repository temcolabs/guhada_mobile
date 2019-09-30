import React, { Component } from 'react';
import css from './DataEmpty.module.scss';

function DataEmpty({ text }) {
  return (
    <div className={css.wrap}>
      <div className={css.infoIcon} />
      <div>{text}</div>
    </div>
  );
}

export default DataEmpty;
