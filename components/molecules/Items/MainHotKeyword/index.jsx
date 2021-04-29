import React from 'react';
import css from './MainHotKeyword.module.scss';

export default function MainHotKeyword({
  hotKeyword = [
    {
      height: '',
      id: '',
      keyword: '',
      priority: '',
      url: '',
      width: '',
    },
  ],
  searchitem,
}) {
  return (
    <div className={css.wrap}>
      <div className={css.header}>HOT KEYWORD</div>
      <div>
        {hotKeyword.map(hot => {
          return (
            <div
              className={css.item}
              onClick={() =>
                searchitem.toSearch({
                  enter: 'brand',
                  keyword: hot.searchKeyword || hot.keyword,
                })
              }
              key={hot.id}
            >
              <div
                className={css.image}
                style={{ backgroundImage: `url(${hot.url})` }}
              />
              <div className={css.keyword}>{`#${hot.keyword}`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
