import React from 'react';
import css from './Tag.module.scss';

export default function Tag({ tags = [], toSearch = () => {} }) {
  return (
    <div className={css.wrap}>
      {tags.map((tag, i) => {
        return (
          <div
            className={css.tag}
            key={i}
            onClick={() => toSearch({ keyword: tag, enter: 'keyword' })}
          >
            {`#${tag}`}
          </div>
        );
      })}
    </div>
  );
}
