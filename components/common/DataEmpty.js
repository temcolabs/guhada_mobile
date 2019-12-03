import React, { Component } from 'react';
import css from './DataEmpty.module.scss';

function DataEmpty({ text, MARGINTOP }) {
  return (
    <div className={css.wrap} style={{ marginTop: MARGINTOP }}>
      <div className={css.infoIcon} />
      <div>{text}</div>
    </div>
  );
}

export default DataEmpty;
