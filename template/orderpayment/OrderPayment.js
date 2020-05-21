import React from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import Controller from 'components/orderpayment/Controller';
import OrderProduct from 'components/orderpayment/OrderProduct';
import OrderCustomer from 'components/orderpayment/OrderCustomer';
import ShippingAddress from 'components/orderpayment/ShippingAddress';
import Benefit from 'components/orderpayment/Benefit';
import FinalAmountBenefit from 'components/orderpayment/FinalAmountBenefit';
import PaymentMethod from 'components/orderpayment/PaymentMethod';
import CashReceipt from 'components/orderpayment/CashReceipt';
import EasyPayment from 'components/orderpayment/EasyPayment';
import PaymentAgreement from 'components/orderpayment/PaymentAgreement';
import PaymentButton from 'components/orderpayment/PaymentButton';
import OtherRequest from 'components/orderpayment/OtherRequest';
import RefundAccount from 'components/orderpayment/RefundAccount';
import PaymentLoading from 'components/orderpayment/modal/PaymentLoading';
import { inject, observer } from 'mobx-react';
import css from './OrderPayment.module.scss';

@inject('orderpayment', 'customerauthentication')
@observer
class OrderPayment extends React.Component {
  componentWillUnmount() {
    sessionStorage.removeItem('paymentInfo'); //임시
    this.props.orderpayment.orderpaymentInit();
  }
  render() {
    let { orderpayment } = this.props;
    return (
      <DefaultLayout
        pageTitle={'주문 결제'}
        headerShape={'orderpayment'}
        kakaoChat={false}
        toolBar={false}
        topButton={false}
      >
        <Controller />

        {orderpayment.status.orderProductOnOffStatus ? (
          <div className={css.orderProduct}>
            {orderpayment.orderProductInfo.length > 0
              ? orderpayment.orderProductInfo.map((data, index) => {
                  return <OrderProduct data={data} key={index} index={index} />;
                })
              : null}
          </div>
        ) : (
          <div className={css.orderProduct}>
            <OrderProduct data={orderpayment.orderProductInfo[0]} key={1} />
          </div>
        )}

        {/* 주문자정보 */}
        <OrderCustomer />

        {/* 배송지 정보 */}
        <ShippingAddress />

        {/* 기타 요청 사항 */}
        <OtherRequest request={orderpayment?.orderShippingList?.otherRequest} />

        {/* 베네핏 */}
        <Benefit />

        {/* 최종 결제 금액 및 적립내역 */}
        <FinalAmountBenefit />

        {/* 결제 수단 */}
        <PaymentMethod />

        {/* 현금영수증 */}
        {orderpayment.status.cashReceipt ? <CashReceipt /> : null}

        {/* 환불 계좌 정보 */}
        {orderpayment.status.VBank ? <RefundAccount /> : null}

        {/* 간편 계좌 정보 */}
        {/**
        {orderpayment.status.EasyPayment ? <EasyPayment /> : null}
         */}

        {/* 결제 동의 */}
        <PaymentAgreement />

        {/* 결제 버튼 */}
        <PaymentButton />

        <PaymentLoading isVisible={orderpayment.status.paymentProceed} />
      </DefaultLayout>
    );
  }
}

export default OrderPayment;
