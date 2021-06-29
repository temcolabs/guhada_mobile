import React, { Component } from 'react';
import css from './ProductDetailOption.module.scss';
import { inject, observer } from 'mobx-react';
import ProductDetailOptionSelectbox from './ProductDetailOptionSelectbox';
import OptionQuantity from './OptionQuantity';
import ProductOptionModal from './ProductOptionModal';
import { SizeGuideModal } from './Modals';
import ModalPortal from 'components/templates/ModalPortal';

@inject('productdetail', 'productoption', 'cartAndPurchase')
@observer
class ProductDetailOption extends Component {
  state = {
    sizeGuideModalOpen: false,
  };
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
          <OptionQuantity
            productoption={productoption}
            sizeGuideModalOpenhandler={() =>
              this.setState({ sizeGuideModalOpen: true })
            }
            sizeImageUrl={productdetail.deals.sizeImageUrl}
          />
        </div>

        {cartAndPurchase.isProductOptionModal && (
          <ProductOptionModal
            onClose={() => {
              this.modalCloseHandler();
            }}
            productoption={productoption}
          />
        )}

        <SizeGuideModal
          isOpen={this.state.sizeGuideModalOpen}
          sizeImageUrl={productdetail.deals.sizeImageUrl}
          onClose={() => this.setState({ sizeGuideModalOpen: false })}
        />
      </div>
    );
  }
}

export default ProductDetailOption;
