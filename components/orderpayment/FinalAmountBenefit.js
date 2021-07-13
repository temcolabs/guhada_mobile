import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './FinalAmountBenefit.module.scss';

@inject('orderpayment')
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
    let { orderpayment } = this.props;
    let { orderInfo, orderSidetabTotalInfo } = orderpayment;
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
            할인 ∙ 포인트
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
              {/* <div className={css.blankBox}>
                {`${
                orderInfo.totalShipPrice === 0
                  ? '무료배송'
                  : `${orderInfo.totalShipPrice.toLocaleString()}원`
              }`}
              </div> */}
              <div>{`${orderSidetabTotalInfo.totalProductPrice?.toLocaleString() ||
                0}원`}</div>
            </div>
            <div className={css.calcBox}>
              {/* <div className={css.blankBox} /> */}
              <div className={css.minusImage} />
            </div>
          </div>
          <div className={css.totalDiscountAmount}>
            <div className={css.innerContent}>
              {/* <div className={css.blankBox} /> */}
              {`${orderSidetabTotalInfo.totalDiscountPointPrice?.toLocaleString() ||
                0}원`}
              <div className={css.calcBox}>
                {/* <div className={css.blankBox} /> */}
                <div className={css.equalImage} />
              </div>
            </div>
          </div>
          <div className={css.totalPaymentAmount}>
            <div className={css.innerContent}>
              {/* <div className={css.blankBox} /> */}
              {`${orderSidetabTotalInfo.totalPaymentPrice?.toLocaleString() ||
                0}`}
              <span>원</span>
            </div>
          </div>
        </div>

        {this.state.discountInfoStatus ? (
          <DiscountInfo
            data={orderSidetabTotalInfo}
            couponHandler={() => {
              orderpayment.couponModalShow();
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
              <span>최대</span>
              <span>
                {orderSidetabTotalInfo.totalDueSavePoint
                  ? ` ${orderSidetabTotalInfo.totalDueSavePoint?.toLocaleString()}`
                  : 0}
              </span>
              <span>P</span>
            </div>
          </div>

          {this.state.benefitInfoStatus ? (
            <BenefitInfo data={orderSidetabTotalInfo} />
          ) : null}
        </div>
      </div>
    );
  }
}

export default FinalAmountBenefit;

const DiscountInfo = (props) => {
  return (
    <div className={css.discountInfoWrap}>
      {props.data.discountInfoResponseList.map((data, index) => {
        return data.discountType === 'PRODUCT_DISCOUNT' ? (
          <div className={css.discountMenu} key={index}>
            <div className={css.sectionTitle}>상품 할인</div>
            <div
              className={css.sectionValue}
            >{`${data.discountPrice?.toLocaleString() || 0}원`}</div>
          </div>
        ) : (
          <div className={css.discountMenu} key={index}>
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
            >{`${data.discountPrice.toLocaleString() || 0}원`}</div>
          </div>
        );
      })}

      {props.data.totalPointPrice ? (
        <div className={css.discountMenu}>
          <div className={css.sectionTitle}>포인트 사용</div>
          <div
            className={css.sectionValue}
          >{`${props.data.totalPointPrice?.toLocaleString() || 0}P`}</div>
        </div>
      ) : null}
    </div>
  );
};

const BenefitInfo = (props) => {
  return (
    <div className={css.benefitInfoWrap}>
      {props.data.totalDueSavePointResponseList.map((data, index) => {
        return (
          <div className={css.discountMenu} key={index}>
            <div className={css.sectionTitle}>
              {data.dueSaveType === 'BUY'
                ? '구매 확정'
                : data.dueSaveType === 'FIRST_ORDER'
                ? '첫 구매'
                : data.dueSaveType === 'REVIEW'
                ? '리뷰 작성'
                : null}
            </div>
            <div className={css.sectionValue}>
              {data.dueSaveType === 'BUY'
                ? `${data.totalPoint?.toLocaleString() || 0}P`
                : data.dueSaveType === 'FIRST_ORDER'
                ? `${data.totalPoint?.toLocaleString() || 0}P`
                : data.dueSaveType === 'REVIEW'
                ? `최대 ${data.totalPoint?.toLocaleString() || 0}P`
                : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};
