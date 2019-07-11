import React from 'react';
import css from './Tag.module.scss';

export default function Tag({ tags = [] }) {
  return (
    <div className={css.wrap}>
      {tags.map((tag, i) => {
        return (
          <div className={css.tag} key={i}>
            {`#${tag}`}
          </div>
        );
      })}
    </div>
  );
}
