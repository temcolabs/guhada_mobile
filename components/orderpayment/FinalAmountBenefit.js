import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './FinalAmountBenefit.module.scss';

@inject('orderpayment', 'orderPaymentPoint')
@observer
class FinalAmountBenefit extends Component {
  render() {
    let { orderpayment, orderPaymentPoint } = this.props;
    let { orderPaymentTotalInfo } = orderpayment;
    return (
      <div className={css.wrap}>
        <div className={css.finalTop}>
          <div className={css.totalOrderTitle}>총 주문금액</div>
          <div className={css.totalDiscountTitle}>
            할인금액
            <div className={css.dropArrowOpacity} />
          </div>
          <div className={css.totalPaymentTitle}>최종 결제금액</div>
        </div>
        <div className={css.finalResult}>
          <div className={css.totalOrderAmount}>
            <div className={css.innerContent}>
              <div className={css.shippingType}>{`${
                orderPaymentTotalInfo.totalShipPrice === 0
                  ? '무료배송'
                  : `${orderPaymentTotalInfo.totalShipPrice.toLocaleString()}원`
              }`}</div>
              <div>{`${orderPaymentTotalInfo.totalProdPrice.toLocaleString()}원`}</div>
            </div>
            <div className={css.minusImage} />
          </div>
          <div className={css.totalDiscountAmount}>
            {`${orderPaymentTotalInfo.totalDiscountDiffPrice.toLocaleString()}원`}
            <div className={css.equalImage} />
          </div>
          <div className={css.totalPaymentAmount}>
            {`${orderPaymentTotalInfo.totalPaymentPrice.toLocaleString()}`}
            <span>원</span>
          </div>
        </div>

        {orderpayment.totalBenefitDetailStatus ? (
          <DiscountInfo point={orderPaymentPoint.usePoint} />
        ) : null}

        <div className={css.dueSavePointWrap}>
          <div className={css.dueSavePointSummary}>
            <div className={css.dueSaveTitle}>
              적립 예정 내역
              <div className={css.dropArrow} />
            </div>
            <div className={css.dueSavePoint}>
              최대{' '}
              <span>
                {orderPaymentPoint.dueSavePointTotal
                  ? `${orderPaymentPoint.dueSavePointTotal.toLocaleString()}`
                  : 0}
              </span>
              p
            </div>
          </div>

          {orderpayment.totalBenefitDetailStatus ? <BenefitInfo /> : null}
        </div>
      </div>
    );
  }
}

export default FinalAmountBenefit;

const DiscountInfo = props => {
  return (
    <div className={css.discountInfoWrap}>
      <div className={css.discountMenu}>
        <div className={css.sectionTitle}>
          쿠폰 할인
          <span className={css.couponChange}>
            <img src="/static/icon/m_coupon_change.png" alt="쿠폰변경" />
          </span>
        </div>
        <div className={css.sectionValue}>0원</div>
      </div>

      <div className={css.discountMenu}>
        <div className={css.sectionTitle}>상품 할인</div>
        <div className={css.sectionValue}>0원</div>
      </div>

      <div className={css.discountMenu}>
        <div className={css.sectionTitle}>포인트 사용</div>
        <div
          className={css.sectionValue}
        >{`${props.point.toLocaleString()}P`}</div>
      </div>
    </div>
  );
};

const BenefitInfo = () => {
  return (
    <div className={css.benefitInfoWrap}>
      <div className={css.discountMenu}>
        <div className={css.sectionTitle}>구매 확정</div>
        <div className={css.sectionValue}>30000원</div>
      </div>

      <div className={css.discountMenu}>
        <div className={css.sectionTitle}>텍스트 리뷰</div>
        <div className={css.sectionValue}>30000원</div>
      </div>

      <div className={css.discountMenu}>
        <div className={css.sectionTitle}>포토 리뷰</div>
        <div className={css.sectionValue}>30000원</div>
      </div>
    </div>
  );
};
