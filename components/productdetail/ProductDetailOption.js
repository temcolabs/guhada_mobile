import React, { Component } from 'react';
import css from './ProductDetailOption.module.scss';
import { inject, observer } from 'mobx-react';
import ProductDetailOptionSelectbox from './ProductDetailOptionSelectbox';
import OptionQuantity from './OptionQuantity';
import ProductOptionModal from './ProductOptionModal';
@inject('productdetail', 'productoption', 'cartAndPurchase')
@observer
class ProductDetailOption extends Component {
  modalCloseHandler() {
    this.props.cartAndPurchase.isProductOptionModal = false;
  }

  render() {
    let { productdetail, productoption, cartAndPurchase } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.title}>옵션선택</div>
        {productdetail.deals.options.length > 0 ? (
          productoption.options.noOption ? null : (
            <div className={css.option__box}>
              <ProductDetailOptionSelectbox />
            </div>
          )
        ) : null}

        <div className={css.optionQuantityBox}>
          <OptionQuantity productoption={productoption} />
        </div>

        <ProductOptionModal
          isVisible={cartAndPurchase.isProductOptionModal}
          onClose={() => {
            this.modalCloseHandler();
          }}
          productoption={productoption}
        />
      </div>
    );
  }
}

export default ProductDetailOption;
