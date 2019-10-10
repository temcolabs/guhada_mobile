import React from 'react';
import css from './RecentItem.module.scss';
export default function RecentItem({
  item,
  clickToSearch = () => {},
  removeItem = () => {},
}) {
  return (
    <div className={css.wrap} onClick={() => clickToSearch(item.name)}>
      <div className={css.name}>{item.name}</div>
      <div
        className={css.close}
        onClick={e => {
          e.stopPropagation();
          removeItem(item.name);
        }}
      >
        {item.date}
      </div>
    </div>
  );
}
