import React, { Component } from 'react';
import css from './OrderProduct.module.scss';

class OrderProduct extends Component {
  render() {
    let { data } = this.props;
    return (
      <div className={css.wrap}>
        <div
          className={css.productImage}
          style={{
            backgroundImage: `url(${data.imageUrl})`,
          }}
        />
        <div className={css.productInfo}>
          <div className={css.brand}>{data.brandName}</div>
          <div className={css.productName}>{`${
            data.season ? data.season : ''
          } ${data.dealName}`}</div>
          <div className={css.productPrice}>
            {`${data.sellPrice?.toLocaleString()}원`}
          </div>
          {!data.itemOptionResponse ? (
            <div className={css.productOpiton}>{`${data.quantity}개`}</div>
          ) : (
            <div className={css.productOpiton}>
              {`${
                data.itemOptionResponse.attribute1
                  ? `${data.itemOptionResponse.attribute1},`
                  : ''
              } ${
                data.itemOptionResponse.attribute2
                  ? `${data.itemOptionResponse.attribute2},`
                  : ''
              } ${
                data.itemOptionResponse.attribute3
                  ? `${data.itemOptionResponse.attribute3},`
                  : ''
              } ${data.quantity}개`}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default OrderProduct;
