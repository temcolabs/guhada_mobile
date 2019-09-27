import React, { Component, Fragment } from 'react';
import css from './CouponSelectModal.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
@inject('orderpayment', 'orderPaymentBenefit')
@observer
class CouponModal extends Component {
  render() {
    const {
      sellerList,
      orderpayment,
      orderPaymentBenefit,
      isVisible,
    } = this.props;
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
                    orderPaymentBenefit.handleModalClose();
                  }}
                />
              </div>
            </div>

            {orderpayment.orderMyCouponWallet.length > 0 ? (
              <div className={css.couponList}>
                {sellerList.map((data, index) => {
                  return (
                    <div className={css.couponItem} key={index}>
                      <div className={css.couponSeller}>{data}</div>
                      {orderPaymentBenefit.couponWithProduct.map(
                        (item, idx) => {
                          return data === item.product.sellerName ? (
                            <Fragment key={idx}>
                              <Product product={item.product} />
                              <CouponDetailList
                                coupon={item.coupon}
                                dealId={item.dealId}
                                selectedCoupon={
                                  orderPaymentBenefit.selectedCouponList[idx]
                                }
                                setSelectCoupon={(a, b) => {
                                  orderPaymentBenefit.setSelectCoupon(a, b);
                                }}
                              />
                            </Fragment>
                          ) : null;
                        }
                      )}
                    </div>
                  );
                })}
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
                  <div>총 주문상품금액</div>
                  <div>{`${orderPaymentBenefit.totalPrice?.prodPrice?.toLocaleString()}원`}</div>
                </div>

                <div className={css.totalDiscountPrice}>
                  <div>총 쿠폰할인금액</div>
                  <div>{`${orderPaymentBenefit.totalPrice?.discountPrice?.toLocaleString()}원`}</div>
                </div>
              </div>
              <div className={css.resultPrice}>
                <div>총 상품금액</div>
                <div>
                  {`${orderPaymentBenefit.totalPrice?.resultProdPrice?.toLocaleString()}`}
                  <span>원</span>
                </div>
              </div>
            </div>

            <div
              className={css.confirmButton}
              onClick={() => orderPaymentBenefit.apply()}
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
        <div className={css.brandName}>{`${product.brandName}`}</div>
        <div className={css.productName}>
          {` ${product.season ? product.season : ''} ${product.dealName}`}
        </div>

        <div className={css.productPrice}>
          {product.sellPrice
            ? `${product.sellPrice.toLocaleString()} 원`
            : `0 원`}
        </div>
        <div className={css.productOption}>
          {product.itemOptionResponse
            ? `${product.itemOptionResponse.attribute1 || ''} ${product
                .itemOptionResponse.attribute2 || ''} ${product
                .itemOptionResponse.attribute3 || ''}`
            : ` `}
        </div>
      </div>
    </div>
  );
};

const CouponDetailList = props => {
  let { coupon, dealId, selectedCoupon, setSelectCoupon } = props;
  // console.log(coupon, dealId, 'coupon');
  return (
    <div className={css.couponDetailList}>
      <div className={css.couponDetail}>
        {coupon.map((data, index) => {
          return (
            <label key={index}>
              <input
                type="radio"
                name={`${dealId}`}
                onChange={() => {
                  setSelectCoupon(dealId, data.couponNumber);
                }}
                disabled={
                  data.usedId ? (data.usedId === dealId ? false : true) : false
                }
                checked={
                  selectedCoupon?.couponNumber === data?.couponNumber
                    ? true
                    : false
                }
              />
              <div
                className={
                  data.usedId
                    ? data.usedId === dealId
                      ? null
                      : css.disabled
                    : null
                }
              >
                {data.discountType === 'PRICE'
                  ? `${data?.discountPrice?.toLocaleString()}`
                  : `${data?.discountRate * 100}%`}
                {data.discountType === 'RATE'
                  ? ` 할인 [${
                      data?.couponTitle
                    }] (${data?.discountPrice?.toLocaleString()} 할인)`
                  : ` 할인 [${data?.couponTitle}]`}
              </div>
            </label>
          );
        })}
        {selectedCoupon?.couponNumber ? (
          <label>
            <input
              type="radio"
              name={`${dealId}`}
              onChange={() => {
                setSelectCoupon(dealId, false);
              }}
            />
            <div>적용안함</div>
          </label>
        ) : (
          <label>
            <input
              type="radio"
              name={`${dealId}`}
              onChange={() => {
                setSelectCoupon(dealId, false);
              }}
              defaultChecked={true}
            />
            <div>적용안함</div>
          </label>
        )}
      </div>
    </div>
  );
};
