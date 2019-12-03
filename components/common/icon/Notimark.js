import React from 'react';
import css from './Notimark.module.scss';

export default function Notimark({ wrapperStyle = {} }) {
  return <span style={wrapperStyle} className={css.wrap} />;
}
