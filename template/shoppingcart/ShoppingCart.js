import React, { Fragment } from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import Controller from 'components/shoppingcart/Controller';
import CartItem from 'components/shoppingcart/CartItem';
import AmountResult from 'components/shoppingcart/AmountResult';
import Notice from 'components/shoppingcart/Notice';
import PurchaseButton from 'components/shoppingcart/PurchaseButton';
import CartEmpty from 'components/shoppingcart/CartEmpty';
import RealTimePopularityProducts from 'components/shoppingcart/RealTimePopularityProducts';
import { inject, observer } from 'mobx-react';
import css from './ShoppingCart.module.scss';
@inject('shoppingcart')
@observer
class ShoppingCart extends React.Component {
  componentDidMount() {
    if (!this.props.shoppingcart.cartList.length) {
      this.props.shoppingcart.getRealTimePopularityProducts();
    }
  }
  render() {
    let { shoppingcart } = this.props;
    let { cartList } = shoppingcart;
    return (
      <DefaultLayout
        headerShape={'shoppingcart'}
        toolBar={cartList.length > 0 ? false : true}
        pageTitle={'장바구니'}
      >
        {cartList.length ? (
          <Fragment>
            {/* 체크박스 컨트롤 */}
            <Controller />

            {/* 장바구니 아이템 */}
            <div className={css.itemWrap}>
              {cartList.map((data, index) => {
                return <CartItem data={data} index={index} key={index} />;
              })}
            </div>
            {/* 주문 결과 창 */}
            <AmountResult />

            {/* 장바구니 NOTICE */}
            <Notice />
            {/* 구매버튼 */}
            <PurchaseButton />
          </Fragment>
        ) : (
          <div className={css.wrap}>
            {/* 장바구니 데이터 없음 */}
            <CartEmpty />

            {/* 실시간 인기상품 */}
            <RealTimePopularityProducts />
          </div>
        )}
      </DefaultLayout>
    );
  }
}

export default ShoppingCart;
