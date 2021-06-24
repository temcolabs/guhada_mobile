import React from 'react';
import css from './ToolbarBrand.module.scss';
import Brand from './_Brand';
import { inject } from 'mobx-react';
import { useRouter } from 'next/router';
import ModalPortal from 'components/templates/ModalPortal';
function ToolbarBrand({ isVisible, onClose, brands }) {
  const router = useRouter();

  return (
    <ModalPortal
      handleClose={() => {
        onClose();
        brands.searchBrand('');
        brands.searchBrandText = '';
      }}
      slide={1}
      gutter
    >
      <div className={css.wrap}>
        <div className={css.header}>브랜드</div>
        <div className={css.itemWrap}>
          <Brand
            isVisible={isVisible}
            onClose={onClose}
            routerPush={router.push}
          />
        </div>
      </div>
    </ModalPortal>
  );
}

export default inject('brands')(ToolbarBrand);
