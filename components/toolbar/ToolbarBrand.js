import React from 'react';
import css from './ToolbarBrand.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import Brand from './_Brand';
import { inject } from 'mobx-react';
import { useRouter } from 'next/router';
function ToolbarBrand({ isVisible, onClose, brands }) {
  const router = useRouter();

  return (
    <div>
      <SlideIn direction={slideDirection.BOTTOM} isVisible={isVisible}>
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
            <Brand
              isVisible={isVisible}
              onClose={onClose}
              routerPush={router.push}
            />
          </div>
        </div>
      </SlideIn>
    </div>
  );
}

export default inject('brands')(ToolbarBrand);
