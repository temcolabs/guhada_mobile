import css from './SlideSection.module.scss';
import { memo } from 'react';

const SlideSection = ({ header, children }) => (
  <section className={css['section']}>
    <h2 className={css['section__header']}>{header}</h2>
    <div className={css['section__content']}>{children}</div>
  </section>
);

export default memo(SlideSection);
