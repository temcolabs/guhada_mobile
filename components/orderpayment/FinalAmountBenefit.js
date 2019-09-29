import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './FinalAmountBenefit.module.scss';

@inject('orderpayment', 'orderPaymentBenefit')
@observer
class FinalAmountBenefit extends Component {
  state = {
    discountInfoStatus: false,
    benefitInfoStatus: false,
  };

  discountInfoHandler = () => {
    this.setState({
      discountInfoStatus: !this.state.discountInfoStatus,
    });
  };
  benefitInfoHandler = () => {
    this.setState({
      benefitInfoStatus: !this.state.benefitInfoStatus,
    });
  };
  render() {
    let { orderpayment, orderPaymentBenefit } = this.props;
    let { orderPaymentTotalInfo } = orderpayment;
    return (
      <div className={css.wrap}>
        <div className={css.finalTop}>
          <div className={css.totalOrderTitle}>상품금액</div>
          <div
            className={css.totalDiscountTitle}
            onClick={() => {
              this.discountInfoHandler();
            }}
          >
            할인∙포인트
            <div
              className={css.dropArrowOpacity}
              style={
                this.state.discountInfoStatus
                  ? { transform: `rotateX(180deg)` }
                  : null
              }
            />
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
            {`${orderPaymentTotalInfo.totalDiscountDiffPrice?.toLocaleString()}원`}
            <div className={css.equalImage} />
          </div>
          <div className={css.totalPaymentAmount}>
            {`${orderPaymentTotalInfo.totalPaymentPrice?.toLocaleString()}`}
            <span>원</span>
          </div>
        </div>

        {this.state.discountInfoStatus ? (
          <DiscountInfo
            point={orderpayment.usePoint}
            coupon={orderPaymentTotalInfo.couponDiscount}
            product={orderPaymentTotalInfo.originDiscountDiffPrice}
            couponHandler={() => {
              orderPaymentBenefit.handleModalShow();
            }}
          />
        ) : null}

        <div className={css.dueSavePointWrap}>
          <div className={css.dueSavePointSummary}>
            <div
              className={css.dueSaveTitle}
              onClick={() => {
                this.benefitInfoHandler();
              }}
            >
              적립 예정 내역
              <div
                className={css.dropArrow}
                style={
                  this.state.benefitInfoStatus
                    ? { transform: `rotateX(180deg)` }
                    : null
                }
              />
            </div>
            <div className={css.dueSavePoint}>
              최대
              <span>
                {orderPaymentBenefit.dueSavePointTotal
                  ? `${orderPaymentBenefit.dueSavePointTotal.toLocaleString()}`
                  : 0}
              </span>
              p
            </div>
          </div>

          {this.state.benefitInfoStatus ? (
            <BenefitInfo dueSaveList={orderPaymentBenefit.dueSaveList} />
          ) : null}
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
          <div
            className={css.couponChange}
            onClick={() => {
              props.couponHandler();
            }}
          />
        </div>
        <div
          className={css.sectionValue}
        >{`${props.coupon.toLocaleString()}원`}</div>
      </div>

      <div className={css.discountMenu}>
        <div className={css.sectionTitle}>상품 할인</div>
        <div
          className={css.sectionValue}
        >{`${props.product.toLocaleString()}원`}</div>
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

const BenefitInfo = props => {
  return (
    <div className={css.benefitInfoWrap}>
      {props.dueSaveList.map((data, index) => {
        return data.pointType === 'BUY' ? (
          <div className={css.discountMenu} key={index}>
            <div className={css.sectionTitle}>구매 확정</div>
            <div
              className={css.sectionValue}
            >{`${data.totalPoint?.toLocaleString()}P`}</div>
          </div>
        ) : data.pointType === 'IMG_REVIEW' ? (
          <div className={css.discountMenu} key={index}>
            <div className={css.sectionTitle}>텍스트 리뷰</div>
            <div
              className={css.sectionValue}
            >{`${data.totalPoint?.toLocaleString()}P`}</div>
          </div>
        ) : data.pointType === 'TEXT_REVIEW' ? (
          <div className={css.discountMenu} key={index}>
            <div className={css.sectionTitle}>포토 리뷰</div>
            <div
              className={css.sectionValue}
            >{`${data.totalPoint?.toLocaleString()}P`}</div>
          </div>
        ) : null;
      })}
    </div>
  );
};
