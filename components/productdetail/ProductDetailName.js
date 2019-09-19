import React, { Component } from 'react';
import css from './ProductDetailName.module.scss';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import copy from 'copy-to-clipboard';
import Router from 'next/router';

@inject('productdetail', 'productDetailBookmark', 'productoption', 'alert')
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
  copyUrlToClipboard = () => {
    const productUrl = `${window.location.protocol}//${window.location.host}${
      Router.router.asPath
    }`;

    copy(productUrl);

    this.props.alert.showAlert('상품 URL이 클립보드에 복사되었습니다.');
  };

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
          <div className={css.product__name}>
            {`${_.isNil(deals.season) === false ? deals.season : ''} ${
              deals.name
            }`}
          </div>
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
            <div className={css.share__btn} onClick={this.copyUrlToClipboard}>
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

        {/* 상품 쿠폰 */}
        {productoption.dueSavebenefitCoupon.length > 0 &&
          productoption.dueSavebenefitCoupon
            .slice(0, 1)
            .map((coupon = {}, index) => {
              // TODO: 쿠폰 다운로드 여부 확인
              const isCouponDownloaded = false;

              return true ? (
                <div
                  className={css.coupon__wrap}
                  onClick={() => {
                    productoption.couponDown();
                  }}
                >
                  <div
                    className={css.coupon__title}
                    style={{ backgroundColor: '#5d2ed1' }}
                  >
                    {productoption.dueSavebenefitCoupon.length > 0
                      ? ` ${productoption.dueSavebenefitCoupon[0].couponTitle}`
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
                    {productoption.dueSavebenefitCoupon.length > 0
                      ? ` ${productoption.dueSavebenefitCoupon[0].couponTitle}`
                      : null}
                  </div>
                  <div
                    className={css.coupon__down}
                    style={{
                      backgroundImage: `url('/static/icon/m_coupon_download_off.png')`,
                    }}
                  />
                </div>
              );
            })}
      </div>
    );
  }
}

export default ProductDetailName;
