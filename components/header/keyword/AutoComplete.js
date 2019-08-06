import React from 'react';
import css from './AutoComplete.module.scss';

export default function AutoComplete({
  autoComplete,
  clickToSearch = () => {},
  highlight,
  index,
  onChangeValue = () => {},
}) {
  let parts = autoComplete.name.split(new RegExp(`(${highlight})`, 'gi'));

  return (
    <div className={css.wrap} onClick={() => clickToSearch(autoComplete.name)}>
      <div className={css.itemWrap}>
        {parts.map((part, i) => (
          <span
            key={i}
            style={
              part.toLowerCase() === highlight.toLowerCase()
                ? { color: '#5d2ed1' }
                : {}
            }
          >
            {part}
          </span>
        ))}
      </div>
    </div>
  );
}
