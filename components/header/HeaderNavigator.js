import React from 'react';
import css from './HeaderNavigator.module.scss';

export default function HeaderNavigator({ onBack, onClose, categoryTitle }) {
  return (
    <div className={css.wrap}>
      <div className={css.prevPage} onClick={onBack} />
      {categoryTitle}
      <div className={css.close} onClick={onClose} />
    </div>
  );
}
