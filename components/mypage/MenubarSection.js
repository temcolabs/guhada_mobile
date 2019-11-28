import React from 'react';
import css from './MenubarSection.module.scss';
import { LinkRoute } from 'childs/lib/router';

export default function MenubarSection({
  links: menuLinks = [
    {
      text: 'menuname',
      asPath: '/',
      isSelected: false,
    },
  ],
}) {
  return (
    <div className={css.wrap}>
      <div className={css.menuList}>
        {menuLinks.map((menuLink, index) => (
          <LinkRoute href={menuLink.asPath || '#'} key={index} prefetch>
            <a className={menuLink.isSelected ? css.isSelected : ''}>
              <div className={css.dot} />
              {menuLink.text}
            </a>
          </LinkRoute>
        ))}
      </div>
    </div>
  );
}
