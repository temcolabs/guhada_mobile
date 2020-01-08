import React, { Component } from 'react';
import css from './DataEmpty.module.scss';

function DataEmpty({ text, MARGINTOP, PADDING }) {
  return (
    <div
      className={css.wrap}
      style={{ marginTop: MARGINTOP, padding: PADDING }}
    >
      <div className={css.infoIcon} />
      <div>{text}</div>
    </div>
  );
}

export default DataEmpty;
