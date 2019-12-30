import React from 'react';
import css from './TextButton.module.scss';
import cn from 'classnames';
import { inject } from 'mobx-react';
import { useObserver } from 'mobx-react-lite';
import { toJS } from 'mobx';
function TextButtonCondition({
  data = [
    {
      value: '',
      label: '',
    },
  ],
  title,
  searchitem,
}) {
  console.log(
    'searchitem.shippingCondition',
    toJS(searchitem.shippingCondition)
  );
  return useObserver(() => (
    <div className={css.wrap}>
      <div className={css.header}>{title}</div>
      <div className={css.itemWrap}>
        {data.map((data, i) => {
          return (
            <div
              className={cn(css.item, {
                [css.selected]:
                  searchitem.shippingCondition === data.value ||
                  searchitem.productCondition === data.value,
              })}
              key={i}
              onClick={() => searchitem.setCondition(data.value, title)}
            >
              {data.label}
            </div>
          );
        })}
      </div>
    </div>
  ));
}
export default inject('searchitem')(TextButtonCondition);
