import React, { Component } from 'react';
import css from './DataEmpty.module.scss';

function DataEmpty({ children, MARGINTOP = '0', PADDING = '0' }) {
  return (
    <div
      className={css.wrap}
      style={{ marginTop: MARGINTOP, padding: PADDING }}
    >
      <div className={css.infoIcon} />
      <div>{children}</div>
    </div>
  );
}

export default DataEmpty;
