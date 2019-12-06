import React from 'react';
import css from './RgbButton.module.scss';
import cn from 'classnames';
import { inject } from 'mobx-react';
import { useObserver } from 'mobx-react-lite';

function RgbButton({
  filter = {
    attributes: [
      { id: 578, name: '#FFD700', selected: false },
      { id: 579, name: '#808080', selected: false },
      { id: 580, name: '#36B401', selected: false },
      { id: 581, name: '#000080', selected: false },
      { id: 582, name: '#AAF543', selected: false },
      { id: 583, name: '#FF0000', selected: false },
    ],
    id: 1,
    name: '색상',
    viewType: 'RGB_BUTTON',
  },
  searchitem,
}) {
  return useObserver(() => (
    <div className={css.wrap}>
      <div className={css.header}>{filter.name}</div>
      <div className={css.rgbWrap}>
        {filter.attributes.map((item, i) => {
          return (
            <div
              className={cn(
                css.rgbItem,
                {
                  [css.select]: item.filter === true,
                },
                { [css.ffffff]: item.name === '#FFFFFF' }
              )}
              style={{ backgroundColor: `${item.name}` }}
              key={i}
              onClick={() => searchitem.setFilter(filter, item)}
            />
          );
        })}
      </div>
    </div>
  ));
}
export default inject('searchitem')(RgbButton);
