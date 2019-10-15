import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './Notice.module.scss';

@inject('shoppingcart')
@observer
class Notice extends Component {
  render() {
    let { shoppingcart } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.innerBox}>
          장바구니에 담긴 상품은 <span>최대 30일</span>간 보관됩니다.
        </div>
      </div>
    );
  }
}

export default Notice;
