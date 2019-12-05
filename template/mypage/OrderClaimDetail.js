import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'next/router';
import css from './OrderCompleteDetail.module.scss'; // NOTE: 주문 상세와 스타일 공유
import cn from 'classnames';
import ClaimOrderItemTable from 'components/mypage/order/ClaimOrderItemTable';
import { inject, observer } from 'mobx-react';
import RefundInfo from 'components/mypage/orderCancel/RefundInfo';
import addHyphenToMobile from 'childs/lib/string/addHyphenToMobile';
import { dateFormat } from 'childs/lib/constant';
import ClaimPaymentInfo from 'components/mypage/order/ClaimPaymentInfo';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import purchaseStatus from 'childs/lib/constant/order/purchaseStatus';
import DetailPageLayout from 'components/layout/DetailPageLayout';
import MypageSectionTitle from 'components/mypage/MypageSectionTitle';

/**
 * 주문 취소 ・ 교환 ・ 반품 상세
 */
@withScrollToTopOnMount
@withRouter
@inject('orderCompleteDetail', 'user', 'orderClaimForm')
@observer
class OrderClaimDetail extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 환불 정보는 교환일 때 표시되지 않아야 한다.
   */
  get isRefundInfoVisible() {
    const isExchange =
      /EXCHANGE/gi.test(this.props.orderClaimForm.claimData?.claimStatus) || // 환불일 때
      this.props.orderClaimForm.claimData?.purchaseStatus ===
        purchaseStatus.WAITING_PAYMENT.code; // 무통장입금결제 입금 대기중일 때

    return isExchange ? false : true;
  }

  componentDidMount() {
    this.initData();
  }

  componentWillUnmount() {
    this.props.orderClaimForm.resetClaimData();
  }

  receiptUrl = null;

  initData = () => {
    const { orderClaimForm } = this.props;

    // 완료 페이지에서는 orderClaimGroupId를 사용한다.
    orderClaimForm.setClaimId({
      orderClaimGroupId: this.props.router?.query?.orderClaimGroupId,
    });

    const job = (claimData = {}) => {
      // 반품 환불예상금액 가져오기
      if (this.isRefundInfoVisible) {
        orderClaimForm.getRefundResponse({
          orderProdGroupId: claimData?.orderProdGroupId,
          quantity: claimData?.quantity,
        });
      }
    };

    orderClaimForm.pushJobForClaimData(job);
  };

  /**
   * 영수증 조회
   */
  handleClickReceiptButton = async () => {
    try {
      const receiptUrl =
        this.receiptUrl ||
        (await this.props.orderCompleteDetail.getReceitUrl(
          this.props.orderClaimForm.claimData?.pgTid
        ));

      this.props.orderCompleteDetail.openReceiptPopup(receiptUrl);
      this.receiptUrl = receiptUrl;
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { orderClaimForm } = this.props;

    return (
      <DetailPageLayout pageTitle="주문 내역 상세">
        <div className={css.wrap}>
          <div className={css.orderInfo}>
            <div className={css.orderInfo__orderId}>
              <div className={css.orderInfo__field}>
                <span className={css.orderInfo__label}>주문번호</span>
                <span className={css.orderInfo__value}>
                  {orderClaimForm.claimData?.purchaseId || '-'}
                </span>
              </div>
              <div className={css.orderInfo__field}>
                <span className={css.orderInfo__label}>주문일</span>
                <span className={cn(css.orderInfo__value, css.withDivider)}>
                  {moment(orderClaimForm.claimData?.orderTimestamp).format(
                    dateFormat.YYYYMMDD_UI
                  )}
                </span>
              </div>
            </div>

            {/* pgTid로 영수증 조회 */}
            {orderClaimForm.claimData?.pgTid && (
              <button
                className={css.orderInfo__receiptButton}
                onClick={this.handleClickReceiptButton}
              >
                영수증 조회
              </button>
            )}
          </div>

          <ClaimOrderItemTable orderList={orderClaimForm.claimDataList} />

          <div className={css.buyerInfomation}>
            <div className={css.buyerInfomation__section}>
              <MypageSectionTitle>주문자 정보</MypageSectionTitle>
              <table className={css.buyerInfomation__table}>
                <tbody>
                  <tr>
                    <td>이름</td>
                    <td>{orderClaimForm.claimData?.buyerName || '-'}</td>
                  </tr>
                  <tr>
                    <td>이메일</td>
                    {/* TODO: email 필드 없음 */}
                    <td>{orderClaimForm.claimData?.buyerEmail || '-'}</td>
                  </tr>
                  <tr>
                    <td>연락처</td>
                    <td>
                      {addHyphenToMobile(
                        orderClaimForm.claimData?.buyerPhone
                      ) || '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={css.buyerInfomation__section}>
              <MypageSectionTitle>배송지 정보</MypageSectionTitle>
              <table className={css.buyerInfomation__table}>
                <tbody>
                  <tr>
                    <td>배송지명</td>
                    <td>{orderClaimForm.claimData?.receiverAddressName}</td>
                  </tr>
                  <tr>
                    <td>배송주소</td>
                    <td>{orderClaimForm.receiverAddressInView}</td>
                  </tr>
                  <tr>
                    <td>받는분</td>
                    <td>{orderClaimForm.claimData?.receiverName}</td>
                  </tr>
                  <tr>
                    <td>연락처</td>
                    <td>
                      {addHyphenToMobile(
                        orderClaimForm.claimData?.receiverPhone
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>배송 메모</td>
                    <td>{orderClaimForm.claimData?.receiverMessage}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <ClaimPaymentInfo claimData={orderClaimForm.claimData} />

          {this.isRefundInfoVisible && (
            <>
              <MypageSectionTitle title="환불금액 정보" />
              <RefundInfo
                // 클레임 상세에서는 getRefundResponse를 하지 않고 order-complete-form에 확정된 데이터를 사용한다
                refundResponse={orderClaimForm.claimData?.refundResponse}
                paymentMethodText={
                  orderClaimForm.claimData?.refundResponse?.paymentMethodText
                }
              />
            </>
          )}
        </div>
      </DetailPageLayout>
    );
  }
}

export default OrderClaimDetail;
