import React from 'react';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import ProductDetailOptionSelectbox from './ProductDetailOptionSelectbox';
import OptionQuantity from './OptionQuantity';
// import CartAndPurchaseButton from './CartAndPurchaseButton';
import css from './ProductOptionModal.module.scss';
function ProductOptionModal({ isVisible, onClose, productoption }) {
  return (
    <>
      <SlideIn direction={slideDirection.BOTTOM} isVisible={isVisible}>
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
      </SlideIn>
    </>
  );
}

export default ProductOptionModal;
