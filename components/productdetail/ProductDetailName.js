import React, { Component } from 'react';
import css from './ProductDetailName.module.scss';
import { inject, observer } from 'mobx-react';

@inject('productdetail', 'productDetailBookmark')
@observer
class ProductDetailName extends Component {
  render() {
    let { productdetail, productDetailBookmark } = this.props;
    let { deals } = productdetail;
    return (
      <div className={css.wrap}>
        <div className={css.inner__top}>
          <div className={css.brandName}>
            {deals.brandName}
            <span className={css.arrow} />
          </div>
          <div className={css.detail__number}>{deals.modelNumber}</div>
        </div>

        <div className={css.inner__middle}>
          <div className={css.product__name}>{`${deals.season} ${
            deals.name
          }`}</div>
        </div>

        <div className={css.inner__bottom}>
          <div className={css.product__price__wrap}>
            <div className={css.product__discount__price}>
              {deals.discountPrice.toLocaleString()}
            </div>
            {deals.discountPrice === deals.sellPrice ? null : (
              <div className={css.product__sell__price}>
                {deals.sellPrice.toLocaleString()}
              </div>
            )}
            {deals.discountPrice === deals.sellPrice ? null : (
              <div className={css.product__discount__rate}>
                {`${deals.discountRate}%`}
              </div>
            )}
          </div>
          <div className={css.utility__wrap}>
            <div className={css.share__btn}>
              <img src="/static/icon/m_share_btn.png" alt="공유하기" />
            </div>
            <div
              className={css.like__btn}
              onClick={() => {
                productDetailBookmark.saveBookmark(deals.productId);
              }}
            >
              {productDetailBookmark.currentLikeCheck ? (
                <img src="/static/icon/m_like_btn_on.png" alt="북마크기능" />
              ) : (
                <img src="/static/icon/m_like_btn_off.png" alt="북마크기능" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductDetailName;
