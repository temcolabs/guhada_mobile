import React, { useState, useEffect } from 'react';
import css from './MainSectionItem.module.scss';
import cn from 'classnames';

import { mainSectionCategory } from 'childs/lib/constant/home/mainSectionCategory';
import SectionItem from './SectionItem';
import { LinkRoute } from 'childs/lib/router';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
function MainSectionItem({
  title = 'PLUS ITEM',
  items,
  categoryId,
  toSearch = () => {},
  condition,
  user,
}) {
  const [isCategory, setIsCategory] = useState('');
  useEffect(() => {
    if (categoryId === 0) setIsCategory('');
    else setIsCategory(categoryId);
  }, [categoryId]);

  useEffect(() => {
    switch (user.userInfo.gender) {
      case 'FEMALE':
        setIsCategory(1);
        break;
      case 'MALE':
        setIsCategory(2);
        break;
      default:
        break;
    }
  }, [user.userInfo.gender]);
  return (
    <>
      <div className={cn(css.wrap, { [css.wrapNotHome]: categoryId !== 0 })}>
        <div
          className={cn(css.title, { [css.titleNotHome]: categoryId !== 0 })}
        >
          {title}
        </div>
        {categoryId === 0 && (
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
        )}
        <div>
          {items['ALL'] !== undefined
            ? mainSectionCategory.map(category => {
                if (category.id === isCategory)
                  return (
                    _.isNil(items[category.key]) === false &&
                    items[category.key].map(item => {
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
                    })
                  );
              })
            : null}
        </div>
        <div
          className={css.viewMoreBtn}
          onClick={() =>
            toSearch({
              category: isCategory,
              enter: 'brand',
              condition: condition,
            })
          }
        >
          VIEW MORE
        </div>
      </div>
      <div className={css.marginArea} />
    </>
  );
}
export default inject('user')(observer(MainSectionItem));
