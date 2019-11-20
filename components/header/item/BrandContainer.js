import React from 'react';
import SlideIn from 'components/search/SearchFilter';
import { slideDirection } from 'components/common/panel/SlideIn';
import css from './BrandContainer.module.scss';
import Brand from 'components/toolbar/Brand';
import { inject } from 'mobx-react';
function BrandContainer({ isVisible, onClose, brands }) {
  return (
    <SlideIn direction={slideDirection.RIGHT} isVisible={isVisible}>
      <div className={css.wrap}>
        <button
          className={css.close}
          onClick={() => {
            onClose();
            brands.searchBrand('');
            brands.searchBrandText = '';
          }}
        />
        <div className={css.header}>브랜드</div>
        <div className={css.itemWrap}>
          <Brand fromHeader={true} onClose={onClose} />
        </div>
      </div>
    </SlideIn>
  );
}

export default inject('brands')(BrandContainer);
