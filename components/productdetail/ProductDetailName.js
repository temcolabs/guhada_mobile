import React, { Component } from 'react';
import css from './ProductDetailName.module.scss';
import { inject, observer } from 'mobx-react';

@inject('productdetail', 'productDetailBookmark', 'productoption')
@observer
class ProductDetailName extends Component {
  getSnapshotBeforeUpdate(prevProps) {
    return prevProps.productdetail.deals.dealsId;
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!snapshot) {
      this.props.productDetailBookmark.productBookmarkInit();
    }
  }
  render() {
    let { productdetail, productDetailBookmark, productoption } = this.props;
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
              {productDetailBookmark.bookMarkImageSrc ? (
                <img src="/static/icon/m_like_btn_on.png" alt="북마크" />
              ) : (
                <img src="/static/icon/m_like_btn_off.png" alt="북마크" />
              )}
            </div>
          </div>
        </div>

        {true ? (
          <div className={css.coupon__wrap}>
            <div
              className={css.coupon__title}
              style={{ backgroundColor: '#5d2ed1' }}
            >
              {productoption.benefitCoupon.length > 0
                ? ` ${productoption.benefitCoupon[0].couponTitle}`
                : null}
            </div>
            <div
              className={css.coupon__down}
              style={{
                backgroundImage: `url('/static/icon/m_coupon_download_on.png')`,
              }}
            />
          </div>
        ) : (
          <div className={css.coupon__wrap}>
            <div
              className={css.coupon__title}
              style={{ backgroundColor: '#ccc' }}
            >
              {productoption.benefitCoupon.length > 0
                ? ` ${productoption.benefitCoupon[0].couponTitle}`
                : null}
            </div>
            <div
              className={css.coupon__down}
              style={{
                backgroundImage: `url('/static/icon/m_coupon_download_off.png')`,
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default ProductDetailName;
