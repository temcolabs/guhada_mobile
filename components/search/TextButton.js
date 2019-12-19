import React from 'react';
import css from './TextButton.module.scss';
import cn from 'classnames';
import { inject } from 'mobx-react';
import { useObserver } from 'mobx-react-lite';

function TextButton({
  filter = {
    attributes: [
      { id: 208, name: '0~3개월', selected: false },
      { id: 209, name: '3~6개월', selected: false },
      { id: 210, name: '6~9개월', selected: false },
      { id: 211, name: '9~12개월', selected: false },
      { id: 212, name: '12~18개월', selected: false },
      { id: 213, name: '18~24개월', selected: false },
      { id: 214, name: '베이비 FREE(one size)', selected: false },
    ],
    id: 30,
    name: '베이비 사이즈(연령)',
    viewType: 'TEXT_BUTTON',
  },
  searchitem,
}) {
  return useObserver(() => (
    <div className={css.wrap}>
      <div className={css.header}>{filter.name}</div>
      <div className={css.itemWrap}>
        {filter.attributes.map(item => {
          return (
            <div
              className={cn(css.item, {
                [css.selected]: item.filter === true,
              })}
              key={item.id}
              onClick={() => searchitem.setFilter(filter, item)}
            >
              {item.name}
            </div>
          );
        })}
      </div>
    </div>
  ));
}
export default inject('searchitem')(TextButton);
