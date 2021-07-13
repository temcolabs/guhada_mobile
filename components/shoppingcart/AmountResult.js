import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './AmountResult.module.scss';

@inject('shoppingcart')
@observer
class ShoppingCartResult extends Component {
  render() {
    let { shoppingcart } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.inner__top}>
          <div
            className={css.total__itemNumber}
          >{`총 ${shoppingcart.selectedCheckNumber.length}개 상품`}</div>
          <div className={css.total__orderPrice}>
            <div className={css.title}>상품금액</div>
            <div
              className={css.amount}
            >{`${shoppingcart.totalAmount.totalProdPrice.toLocaleString()}원`}</div>
          </div>
          <div className={css.total__shipPrice}>
            <div className={css.title}>배송비</div>
            <div
              className={css.amount}
            >{`${shoppingcart.totalAmount.totalShipPrice.toLocaleString()}원`}</div>
          </div>
          <div className={css.total__discountPrice}>
            <div className={css.title}>
              할인금액
              {/* <span>
                <img src="/public/icon/m_cart_arrow.png" alt="탭 화살표" />
              </span> */}
            </div>
            <div
              className={css.amount}
            >{`${shoppingcart.totalAmount.totalDiscountDiffPrice.toLocaleString()}원`}</div>
          </div>
        </div>
        <div className={css.inner__bottom}>
          <div className={css.totalResult}>할인 적용금액</div>
          <div className={css.totalResultPrice}>
            {`${shoppingcart.totalAmount.totalPaymentPrice.toLocaleString()}`}
            <span>원</span>
          </div>
        </div>
      </div>
    );
  }
}

export default ShoppingCartResult;
