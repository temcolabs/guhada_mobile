import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './Benefit.module.scss';
import CouponSelectModal from './modal/CouponSelectModal';
@inject('orderpayment', 'orderPaymentBenefit', 'alert')
@observer
class Benefit extends Component {
  state = {
    sellerList: [],
    couponProductList: [],
  };
  pointHandler = e => {
    let { orderpayment, orderPaymentBenefit, alert } = this.props;
    let value = e.target.value.replace(/[^0-9]/g, '');
    value = Number(value);
    console.log(value, 'value');

    if (value > orderPaymentBenefit.availablePoint) {
      alert.showAlert({
        content: '최대 사용 가능 포인트 초과 입니다.',
      });

      orderpayment.usePoint = orderPaymentBenefit.availablePoint;
      orderpayment.getPaymentInfo();
    } else {
      orderpayment.usePoint = value;
      orderpayment.getPaymentInfo();
    }
  };

  pointfullUse = () => {
    let { orderpayment, orderPaymentBenefit } = this.props;

    if (orderPaymentBenefit.myPoint >= orderPaymentBenefit.availablePoint) {
      orderpayment.usePoint = orderPaymentBenefit.availablePoint;

      orderpayment.getPaymentInfo();
    } else {
      orderpayment.usePoint = orderPaymentBenefit.myPoint;

      orderpayment.getPaymentInfo();
    }
  };
  componentDidMount() {
    this.props.orderPaymentBenefit.getAvailablePoint();
    this.props.orderPaymentBenefit.getMyPoint();
    this.props.orderPaymentBenefit.getMyCoupon();
    this.props.orderPaymentBenefit.getDueSavePoint();

    this.setCouponList();
  }
  setCouponList = () => {
    let orderProduct = this.props.orderpayment.orderProductInfo;
    let couponWallet = this.props.orderpayment.orderMyCouponWallet;
    let tempCouponProductList = [];
    let tempSellerList = [];
    let tempData = {};

    if (couponWallet.length > 0) {
      for (let i = 0; i < orderProduct.length; i++) {
        for (let j = 0; j < couponWallet.length; j++) {
          tempData = {};
          if (orderProduct[i].dealId === couponWallet[j].dealId) {
            tempData.product = orderProduct[i];
            tempData.coupon = couponWallet[j].couponWalletResponseList;
            tempData.dealId = couponWallet[j].dealId;
            // tempData.usedCouponList = [];
            tempCouponProductList.push(tempData);
          }
        }
      }
    }

    for (let i = 0; i < tempCouponProductList.length; i++) {
      tempSellerList.push(tempCouponProductList[i].product.sellerName);
    }
    tempSellerList = [...new Set(tempSellerList)];

    this.setState(
      {
        sellerList: this.state.sellerList.concat(...tempSellerList),
        couponProductList: this.state.couponProductList.concat(
          ...tempCouponProductList
        ),
      },
      () => {
        this.props.orderPaymentBenefit.setCouponWithProduct(
          this.state.couponProductList
        );
      }
    );
  };
  render() {
    let { orderpayment, orderPaymentBenefit } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.title}>할인적용</div>

        <div className={css.coupon}>
          <div className={css.couponTitle}>
            쿠폰
            <span> (사용가능 </span>
            <span className={css.myCoupon}>
              {orderpayment.orderPaymentTotalInfo.availableCouponCount}
            </span>
            <span>{`장 / 보유 ${
              orderpayment.orderPaymentTotalInfo.totalCouponCount
            } 장)`}</span>
          </div>
          <div className={css.couponSelectBox}>
            <div className={css.couponInput}>
              {orderPaymentBenefit.applyCoupon.applyCouponAmount ? (
                <div
                  className={css.applyCoupon}
                >{`${orderPaymentBenefit.applyCoupon.applyDiscount?.toLocaleString()}원 (${
                  orderPaymentBenefit.applyCoupon.applyCouponAmount
                }장)`}</div>
              ) : (
                <div>
                  {orderpayment.orderPaymentTotalInfo?.availableCouponCount
                    ? '쿠폰을 선택해주세요 '
                    : '적용 가능한 쿠폰이 없습니다.'}
                </div>
              )}
            </div>
            {orderpayment.orderPaymentTotalInfo.availableCouponCount ? (
              <div
                className={css.couponSelect}
                onClick={() => {
                  orderPaymentBenefit.handleModalShow();
                }}
              >
                쿠폰변경
              </div>
            ) : (
              <div className={css.nocouponSelect}>쿠폰변경</div>
            )}
          </div>
        </div>

        <CouponSelectModal
          isVisible={orderPaymentBenefit.isOpen}
          sellerList={this.state.sellerList}
        />

        <div className={css.point}>
          <div className={css.pointTitle}>
            <div>포인트</div>
            <div>
              (사용가능{' '}
              <span>
                {orderpayment.orderPaymentTotalInfo.availablePointResponse.availableTotalPoint?.toLocaleString()}
              </span>
              P)
            </div>
          </div>
          <div className={css.pointSelectBox}>
            <div className={css.pointSelect}>
              <input
                type="text"
                value={orderpayment.usePoint?.toLocaleString()}
                onChange={e => {
                  this.pointHandler(e);
                }}
              />
            </div>
            <div
              className={css.pointAutoSelect}
              onClick={() => {
                this.pointfullUse();
              }}
            >
              전액 사용
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Benefit;
