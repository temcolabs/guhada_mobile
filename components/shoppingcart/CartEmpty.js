import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './CartEmpty.module.scss';
import { LinkRoute } from 'lib/router';
@inject('shoppingcart')
@observer
class CartEmpty extends Component {
  render() {
    return (
      <div className={css.wrap}>
        <div className={css.cartEmpty}>
          <div>장바구니에</div>
          <div>담긴 상품이 없습니다.</div>
        </div>
        <div className={css.buttonGroup}>
          <LinkRoute href="/">
            <div className={css.continueShopping}>쇼핑 계속하기</div>
          </LinkRoute>
          <div
            className={css.goLike}
            onClick={() => {
              this.props.shoppingcart.goLike();
            }}
          >
            찜한 상품 보기
          </div>
        </div>
      </div>
    );
  }
}

export default CartEmpty;
