import React from 'react';
import css from './ToolbarCategory.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import Category from './Category';

export default function ToolbarCategory({ isVisible, onClose }) {
  return (
    <div>
      <SlideIn direction={slideDirection.BOTTOM} isVisible={isVisible}>
        <div className={css.wrap}>
          <button className={css.close} onClick={onClose} />
          <div className={css.header}>카테고리</div>
          <div className={css.itemWrap}>
            <Category />
          </div>
        </div>
      </SlideIn>
    </div>
  );
}
