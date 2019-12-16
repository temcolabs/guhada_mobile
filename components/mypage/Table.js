import React from 'react';
import cn from 'classnames';
import css from './Table.module.scss';

export default function Table({ className = '', wrapperStyle = {}, children }) {
  return (
    <table style={wrapperStyle} className={cn(css.wrap, className)}>
      {children}
    </table>
  );
}
