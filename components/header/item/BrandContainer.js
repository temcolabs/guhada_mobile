import React from 'react';
import SlideIn from 'components/search/SearchFilter';
import { slideDirection } from 'components/common/panel/SlideIn';
import css from './BrandContainer.module.scss';
import Brand from 'components/toolbar/Brand';

export default function BrandContainer({ isVisible, onClose }) {
  return (
    <div>
      <SlideIn direction={slideDirection.RIGHT} isVisible={isVisible}>
        <div className={css.wrap}>
          <button className={css.close} onClick={onClose} />
          <div className={css.header}>브랜드</div>
          <div className={css.itemWrap}>
            <Brand fromHeader={true} />
          </div>
        </div>
      </SlideIn>
    </div>
  );
}
