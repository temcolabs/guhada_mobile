import React from 'react';
import css from './ToolbarBrand.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import Brand from './Brand';

export default function ToolbarBrand({ isVisible, onClose }) {
  return (
    <div>
      <SlideIn direction={slideDirection.BOTTOM} isVisible={isVisible}>
        <div className={css.wrap}>
          <button className={css.close} onClick={onClose} />
          <div className={css.header}>브랜드</div>
          <div className={css.itemWrap}>
            <Brand />
          </div>
        </div>
      </SlideIn>
    </div>
  );
}
