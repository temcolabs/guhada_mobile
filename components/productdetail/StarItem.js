import React from 'react';

export default function StarItem(item) {
  let rating;
  console.log('item', item);
  switch (item) {
    case 'HALF':
      rating = 0.5;
      break;
    case 'ONE':
      rating = 1;
      break;
    case 'ONE_HALF':
      rating = 1.5;
      break;
    case 'TWO':
      rating = 2;
      break;
    case 'TWO_HALF':
      rating = 2.5;
      break;
    case 'THREE':
      rating = 3;
      break;
    case 'THREE_HALF':
      rating = 3.5;
      break;
    case 'FOUR':
      rating = 4;
      break;
    case 'FOUR_HALF':
      rating = 4.5;
      break;
    case 'FIVE':
      rating = 5;
      break;
    default:
      rating = 0;
      break;
  }

  let starCount = rating * 2;
  let starItems = [];

  for (let i = 0; i < 10; i++) {
    if (i < starCount) {
      if (i % 2 === 0)
        starItems.push(
          <img
            src="/static/icon/ministar_yellow_l.png"
            width={6}
            height={14}
            key={i}
            alt={`ministar_yellow_left`}
          />
        );
      else
        starItems.push(
          <img
            src="/static/icon/ministar_yellow_r.png"
            width={6}
            height={14}
            key={i}
            alt={`ministar_yellow_right`}
          />
        );
    } else if (i % 2 === 0)
      starItems.push(
        <img
          src="/static/icon/ministar_grey_l.png"
          width={6}
          height={14}
          key={i}
          alt={`ministar_grey_left`}
        />
      );
    else
      starItems.push(
        <img
          src="/static/icon/ministar_grey_r.png"
          width={6}
          height={14}
          key={i}
          alt={`ministar_grey_right`}
        />
      );
  }
  return <>{starItems}</>;
}
