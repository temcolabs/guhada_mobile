import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './ProductInfo.module.scss';
@inject('orderpaymentsuccess')
@observer
class ProductInfo extends Component {
  render() {
    let {
      orderSuccessProduct,
      orderSuccessProductOption,
    } = this.props.orderpaymentsuccess;
    return (
      <div className={css.wrap}>
        {orderSuccessProduct.map((data, index) => {
          return (
            <div className={css.proudct} key={index}>
              <div
                className={css.productImage}
                style={{
                  backgroundImage: `url(${data.imageUrl})`,
                }}
              />
              <div className={css.productInfo}>
                <div className={css.brandName}>{data.brandName}</div>
                <div className={css.productName}>{`${
                  data.season ? data.season : ''
                } ${data.prodName}`}</div>
                <div className={css.productPrice}>
                  {`${data.originalPrice?.toLocaleString()}원`}
                </div>
                <div className={css.productOption}>
                  {`${
                    orderSuccessProductOption[index]
                      ? orderSuccessProductOption[index]
                      : ' '
                  }`}
                  {`${data.quantity}개`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ProductInfo;
