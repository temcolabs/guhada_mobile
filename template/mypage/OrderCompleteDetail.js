import React, { Component } from 'react';
import { withRouter } from 'next/router';
import css from './OrderCompleteDetail.module.scss';
import cn from 'classnames';
import DetailPageLayout from 'components/layout/DetailPageLayout';
import PaymentInfo from 'components/mypage/order/PaymentInfo';
import OrderItemTable from 'components/mypage/order/OrderItemTable';
import { inject, observer } from 'mobx-react';
import addHyphenToMobile from 'childs/lib/string/addHyphenToMobile';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import MypageSectionTitle from 'components/mypage/MypageSectionTitle';
import withReviewModal from 'components/mypage/review/withReviewModal';
import copy from 'copy-to-clipboard';

@withReviewModal
@withScrollToTopOnMount
@withRouter
@inject('orderCompleteDetail', 'orderClaimList', 'user', 'alert')
@observer
class OrderCompleteDetail extends Component {
  get purchaseId() {
    return this.props.router.query.purchaseId;
  }

  componentDidMount() {
    const { orderCompleteDetail } = this.props;
    orderCompleteDetail.getOrderComplete(this.purchaseId);
  }

  copyAccountToClipboard = vbankNo => {
    copy(vbankNo);

    this.props.alert.showAlert('계좌번호가 복사되었습니다.');
  };

  render() {
    const { orderCompleteDetail } = this.props;
    const { data: orderData } = orderCompleteDetail;
    const { shippingAddress = {} } = orderData; // 배송지 정보

    return (
      <DetailPageLayout pageTitle={'주문 내역 상세'} noPaddingBottom>
        <div className={css.wrap}>
          <div className={css.orderInfo}>
            <div className={css.orderInfo__orderId}>
              <div className={css.orderInfo__field}>
                <span className={css.orderInfo__label}>주문번호</span>
                <span className={css.orderInfo__value}>
                  {orderData.orderNumber || '-'}
                </span>
              </div>
              <div className={css.orderInfo__field}>
                <span className={css.orderInfo__label}>주문일</span>
                <span className={cn(css.orderInfo__value, css.withDivider)}>
                  {orderCompleteDetail.orderDateWithFormat}
                </span>
              </div>
            </div>

            {/* pgTid로 영수증 조회 */}
            {orderData?.pgTid && (
              <button
                className={css.orderInfo__receiptButton}
                onClick={() =>
                  orderCompleteDetail.openReceiptPopup(
                    orderCompleteDetail.receiptUrl
                  )
                }
              >
                영수증 조회
              </button>
            )}
          </div>

          <OrderItemTable orderList={orderData?.orderList} />

          {/* 구매자 정보 */}
          <div className={css.buyerInfomation}>
            <div className={css.buyerInfomation__section}>
              <MypageSectionTitle>주문자 정보</MypageSectionTitle>
              <table className={css.buyerInfomation__table}>
                <tbody>
                  <tr>
                    <td>이름</td>
                    <td>{orderData?.buyerName || '-'}</td>
                  </tr>
                  <tr>
                    <td>이메일</td>
                    {/* TODO: email 필드 없음 */}
                    <td>{orderData?.buyerEmail || '-'}</td>
                  </tr>
                  <tr>
                    <td>연락처</td>
                    <td>{addHyphenToMobile(orderData?.buyerPhone) || '-'}</td>
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
                    <td>{shippingAddress.addressName}</td>
                  </tr>
                  <tr>
                    <td>배송주소</td>
                    <td>{orderCompleteDetail.addressInView}</td>
                  </tr>
                  <tr>
                    <td>받는분</td>
                    <td>{shippingAddress.receiverName}</td>
                  </tr>
                  <tr>
                    <td>연락처</td>
                    <td>{addHyphenToMobile(shippingAddress.phone)}</td>
                  </tr>
                  <tr>
                    <td>배송 메모</td>
                    <td>{shippingAddress.message}</td>
                  </tr>
                  <tr>
                    <td>기타 요청 사항</td>
                    <td>{orderData?.etcMessage || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <PaymentInfo
            order={orderData}
            copyAccountToClipboard={this.copyAccountToClipboard}
          />
        </div>
      </DetailPageLayout>
    );
  }
}

export default OrderCompleteDetail;
