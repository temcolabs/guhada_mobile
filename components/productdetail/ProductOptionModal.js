import React from 'react';
import ProductDetailOptionSelectbox from './ProductDetailOptionSelectbox';
import OptionQuantity from './OptionQuantity';
import css from './ProductOptionModal.module.scss';
import ModalPortal from 'components/templates/ModalPortal';
function ProductOptionModal({ onClose, productoption }) {
  return (
    <ModalPortal slide={1} handleClose={onClose} closeButton={false}>
      <div className={css.wrap}>
        <div className={css.innerWrap}>
          <div className={css.header}>
            <div className={css.title}>옵션 선택</div>
            <div className={css.close} onClick={onClose} />
          </div>
          <div className={css.optionBox}>
            <ProductDetailOptionSelectbox />
          </div>
          <div className={css.optionQuantityBox}>
            <OptionQuantity productoption={productoption} />
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

export default ProductOptionModal;
