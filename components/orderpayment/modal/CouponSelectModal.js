import React, { Component, Fragment } from 'react';
import css from './CouponSelectModal.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
@inject('orderpayment')
@observer
class CouponModal extends Component {
  render() {
    const { orderpayment, isVisible } = this.props;
    return (
      <Fragment>
        <SlideIn direction={slideDirection.BOTTOM} isVisible={isVisible}>
          <div className={css.wrap}>
            <div className={css.header}>
              <div>
                <div className={css.title}>쿠폰 적용</div>
                <div
                  className={css.close}
                  onClick={() => {
                    orderpayment.couponModalClose();
                  }}
                />
              </div>
            </div>

            {orderpayment.orderCouponInfo?.availableCouponCount > 0 ? (
              <div className={css.couponList}>
                {orderpayment.orderCouponInfo?.benefitSellerResponseList.map(
                  (data, index) => {
                    return (
                      <div className={css.couponItem} key={index}>
                        <div className={css.couponSeller}>
                          {data.sellerName ? data.sellerName : ' '}
                        </div>
                        {data.benefitOrderProductResponseList.map(
                          (item, idx) => {
                            return (
                              <Fragment key={idx}>
                                <Product product={item} />
                                <CouponDetailList
                                  coupon={item.benefitProductCouponResponseList}
                                  // dealId={item.dealId}
                                  // selectedCoupon={
                                  //   orderPaymentBenefit.selectedCouponList[idx]
                                  // }
                                  cartId={item.cartId}
                                  selectedCouponList={
                                    orderpayment.selectedCouponList
                                  }
                                  setSelectCoupon={(
                                    cartId,
                                    sellerId,
                                    couponNumber,
                                    couponDiscountPrice
                                  ) => {
                                    orderpayment.setSelectCoupon(
                                      cartId,
                                      sellerId,
                                      couponNumber,
                                      couponDiscountPrice
                                    );
                                  }}
                                />
                              </Fragment>
                            );
                          }
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <div className={css.nonCouponList}>사용가능 쿠폰이 없습니다.</div>
            )}

            <div className={css.couponResultWrap}>
              <div className={css.totalSummary}>
                <div className={css.couponTotal}>{`총 ${
                  orderpayment.orderProductInfo.length
                }개 상품`}</div>
                <div className={css.totalOrderPrice}>
                  <div>상품 할인 적용금액</div>
                  <div>{`${orderpayment.orderCouponInfo?.totalProductPrice?.toLocaleString()}원`}</div>
                </div>

                <div className={css.totalDiscountPrice}>
                  <div>쿠폰 할인</div>
                  <div>{`${orderpayment?.totalCouponDiscount?.toLocaleString()}원`}</div>
                </div>
              </div>
              <div className={css.resultPrice}>
                <div>할인 후 구매금액</div>
                <div>
                  {`${orderpayment.totalDiscountPrice?.toLocaleString()}원`}
                  <span>원</span>
                </div>
              </div>
            </div>

            <div
              className={css.confirmButton}
              onClick={() => orderpayment.couponApply()}
            >
              적용하기
            </div>
          </div>
        </SlideIn>
      </Fragment>
    );
  }
}

export default CouponModal;

const Product = props => {
  let { product } = props;
  return (
    <div className={css.product}>
      <div
        className={css.productImage}
        style={{
          backgroundImage: `url(${product.imageUrl})`,
        }}
      />
      <div className={css.productInfo}>
        <div className={css.brandName}>{`${
          product.brandName ? product.brandName : ''
        }`}</div>
        <div className={css.productName}>
          {` ${product.season ? product.season : ''} ${product.dealName}`}
        </div>

        <div className={css.productPrice}>
          {product.orderPrice
            ? `${product.orderPrice.toLocaleString()} 원`
            : `0 원`}
        </div>

        <div className={css.productOption}>
          <div>{`${product.option ? product.option : ' '} ${
            product.currentQuantity
          }개`}</div>
        </div>
      </div>
    </div>
  );
};

const CouponDetailList = props => {
  let { coupon, cartId, setSelectCoupon } = props;
  return (
    <div className={css.couponDetailList}>
      <div className={css.couponDetail}>
        {coupon.map((data, index) => {
          return (
            <label key={index}>
              <input
                type="radio"
                name={cartId}
                disabled={data.disable}
                checked={data.selected}
                onChange={() => {
                  setSelectCoupon({
                    cartId: cartId,
                    sellerId: data.sellerId,
                    couponNumber: data.couponNumber,
                    couponDiscountPrice: data.couponDiscountPrice,
                  });
                }}
              />
              <div className={css.radioBtn} />
              <div className={data.disable === true ? css.disabled : null}>
                {data.discountType === 'PRICE'
                  ? `${data?.couponDiscountPrice?.toLocaleString()} 할인`
                  : `${data?.discountRate}% 할인`}

                {data.discountType === 'RATE'
                  ? ` [${
                      data?.couponTitle
                    }] (${data?.couponDiscountPrice?.toLocaleString()} 원 할인)`
                  : ` [${data?.couponTitle}]`}
              </div>
            </label>
          );
        })}
        <label>
          <input
            type="radio"
            name={cartId}
            onChange={() => {
              setSelectCoupon({
                cartId: cartId,
                sellerId: coupon[0]?.sellerId ? coupon[0]?.sellerId : null,
                couponNumber: '',
                couponDiscountPrice: 0,
              });
            }}
          />
          <div className={css.radioBtn} />
          <div>적용안함</div>
        </label>
      </div>
    </div>
  );
};
