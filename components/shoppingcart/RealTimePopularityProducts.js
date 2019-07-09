import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './RealTimePopularityProducts.module.scss';
@inject('shoppingcart')
@observer
class RealTimePopularityProducts extends Component {
  render() {
    return (
      <div className={css.wrap}>
        <div className={css.title}>실시간 인기상품</div>
      </div>
    );
  }
}

export default RealTimePopularityProducts;
