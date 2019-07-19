import React from 'react';
import css from './RgbButton.module.scss';
export default function RgbButton({
  filter = {
    attributes: [
      { id: 578, name: '#FFD700', selected: false },
      { id: 579, name: '#808080', selected: false },
      { id: 580, name: '#36B401', selected: false },
      { id: 581, name: '#000080', selected: false },
      { id: 582, name: '#AAF543', selected: false },
      { id: 583, name: '#FF0000', selected: false },
      { id: 584, name: '#71ECDC', selected: false },
      { id: 585, name: '#8865E0', selected: false },
      { id: 586, name: '#A62C54', selected: false },
      { id: 587, name: '#F4D6A1', selected: false },
      { id: 588, name: '#8B4513', selected: false },
      { id: 589, name: '#000000', selected: false },
      { id: 590, name: '#0000FF', selected: false },
      { id: 591, name: '#87CEEB', selected: false },
      { id: 592, name: '#C0C0C0', selected: false },
      { id: 593, name: '#F2EFDE', selected: false },
      { id: 594, name: '#FFFF00', selected: false },
      { id: 595, name: '#FFA500', selected: false },
      { id: 596, name: '#4A515F', selected: false },
      { id: 597, name: '#D6855A', selected: false },
      { id: 598, name: '#71842F', selected: false },
      { id: 599, name: '#800080', selected: false },
      { id: 600, name: '#FFC0CB', selected: false },
      { id: 601, name: '#F7027C', selected: false },
      { id: 602, name: '#FFFFFF', selected: false },
    ],
    id: 1,
    name: '색상',
    viewType: 'RGB_BUTTON',
  },
}) {
  return (
    <div className={css.wrap}>
      <div className={css.header}>{filter.name}</div>
      <div className={css.rgbWrap}>
        {filter.attributes.map(item => {
          return (
            <div
              className={css.rgbItem}
              style={{ backgroundColor: `${item.name}` }}
              key={item.id}
            />
          );
        })}
      </div>
    </div>
  );
}
