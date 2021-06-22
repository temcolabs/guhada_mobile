import css from './SlideSection.module.scss';
import { memo } from 'react';
import cn from 'classnames';

const SlideSection = ({ header, responsive, children }) => (
  <section className={css['section']}>
    <h2 className={css['section__header']}>{header}</h2>
    <div
      className={cn(css['section__content'], responsive && css['responsive'])}
    >
      {children}
    </div>
  </section>
);

export default memo(SlideSection);
