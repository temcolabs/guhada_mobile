import React, { useState, Fragment } from 'react';
import css from './MainSectionItem.module.scss';
import cn from 'classnames';
import { toJS } from 'mobx';

import { mainSectionCategory } from 'constant/home/mainSectionCategory';
import SectionItem from './SectionItem';
import { LinkRoute } from 'lib/router';

export default function MainSectionItem({ title = 'PLUS ITEM', items }) {
  const [isCategory, setIsCategory] = useState('');

  return (
    <>
      <div className={css.wrap}>
        <div className={css.title}>{title}</div>
        <div className={css.categoryWrap}>
          {mainSectionCategory.map((category, index) => {
            return (
              <div
                className={cn(css.item, {
                  [css.selected]: category.id === isCategory,
                })}
                onClick={() => setIsCategory(category.id)}
                key={index}
              >
                <div className={css.dot} />
                {category.label}
              </div>
            );
          })}
        </div>
        <div>
          {items['ALL'] !== undefined
            ? mainSectionCategory.map(category => {
                if (category.id === isCategory)
                  return items[category.key].map(item => {
                    return (
                      <LinkRoute
                        href={`/productdetail?deals=${item.dealId}`}
                        key={item.dealId}
                      >
                        <a>
                          <SectionItem item={item} />
                        </a>
                      </LinkRoute>
                    );
                  });
              })
            : null}
        </div>
      </div>
      <div className={css.marginArea} />
    </>
  );
}
