import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './RealTimePopularityProducts.module.scss';
@inject('shoppingcart')
@observer
class RealTimePopularityProducts extends Component {
  render() {
    let { shoppingcart } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.title}>실시간 인기상품</div>
        <ul className={css.productWrap}>
          {shoppingcart.realTimePopularityProducts.map((data, index) => {
            return (
              <li className={css.productItem} key={index}>
                <div
                  className={css.productItemImage}
                  style={{
                    backgroundImage: `url('${data.imageUrl}')`,
                  }}
                ></div>
                <div className={css.brandName}>
                  <div>{data.brandName}</div>
                  <div>{data.productSeason}</div>
                </div>
                <div className={css.productName}>{data.productName}</div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default RealTimePopularityProducts;
