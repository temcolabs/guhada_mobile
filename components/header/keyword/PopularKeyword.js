import React from 'react';
import css from './PopularKeyword.module.scss';
import cn from 'classnames';

export default function PopularKeyword({
  list,
  rank,
  clickToSearch = () => {},
}) {
  let rankChangeCheck;
  var reg = /[-]/g;

  rankChangeCheck = list.rankChange.search(reg);

  if (list.rankChange.search(reg) !== -1) {
    rankChangeCheck = 1;
  } else if (list.rankChange === '0') {
    rankChangeCheck = 0;
  } else if (list.rankChange === 'new') {
    rankChangeCheck = 'new';
  }

  return (
    <div className={css.wrap} onClick={() => clickToSearch(list.keyword)}>
      <div className={css.keywordWrap}>
        <div
          className={cn(css.rank, {
            [css.top]: rank === 0 || rank === 1 || rank === 2,
          })}
        >
          {rank + 1}
        </div>
        <div>{list.keyword}</div>
      </div>
      <div
        className={cn(
          css.rankChange,
          { [css.down]: rankChangeCheck === 1 },
          { [css.equal]: rankChangeCheck === 0 },
          { [css.up]: rankChangeCheck === -1 },
          { [css.new]: rankChangeCheck === 'new' }
        )}
      >
        {list.rankChange !== '0' && list.rankChange}
      </div>
    </div>
  );
}
