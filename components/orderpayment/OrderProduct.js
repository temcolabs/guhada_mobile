import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './OrderProduct.module.scss';

@inject('orderpayment')
@observer
class OrderProduct extends Component {
  render() {
    let { orderpayment, data, index } = this.props;
    return (
      <div className={css.wrap}>
        <div
          className={css.productImage}
          style={{
            backgroundImage: `url(${data.imageUrl})`,
          }}
        ></div>
        <div className={css.productInfo}>
          <div className={css.brand}>{data.brandName}</div>
          <div
            className={css.productName}
          >{`${data.season} ${data.dealName}`}</div>
          <div className={css.productPrice}>
            {`${data.discountPrice.toLocaleString()}원`}
          </div>
          <div
            className={css.productOpiton}
          >{`${orderpayment.option[index]} / ${data.quantity}개`}</div>
        </div>
      </div>
    );
  }
}

export default OrderProduct;
