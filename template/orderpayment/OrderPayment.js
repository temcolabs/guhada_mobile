import React from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import Controller from 'components/orderpayment/Controller';
import OrderProduct from 'components/orderpayment/OrderProduct';
import OrderCustomer from 'components/orderpayment/OrderCustomer';
import ShippingAddress from 'components/orderpayment/ShippingAddress';
import Benefit from 'components/orderpayment/Benefit';
import FinalAmountBenefit from 'components/orderpayment/FinalAmountBenefit';
import PaymentMethod from 'components/orderpayment/PaymentMethod';
import PaymentAgreement from 'components/orderpayment/PaymentAgreement';
import PaymentButton from 'components/orderpayment/PaymentButton';
import { inject, observer } from 'mobx-react';
import css from './OrderPayment.module.scss';
@inject('orderpayment')
@observer
class OrderPayment extends React.Component {
  render() {
    let { orderpayment } = this.props;
    return (
      <DefaultLayout pageTitle={'주문 결제'}>
        <Controller />

        {orderpayment.status.orderProductOnOffStatus ? (
          <div className={css.orderProduct}>
            {orderpayment.orderProductInfo.length > 0
              ? orderpayment.orderProductInfo.map((data, index) => {
                  return <OrderProduct data={data} key={index} index={index} />;
                })
              : null}
          </div>
        ) : null}

        {/* 주문자정보 */}
        <OrderCustomer />

        {/* 배송지 정보 */}
        <ShippingAddress />

        {/* 베네핏 */}
        <Benefit />

        {/* 최종 결제 금액 */}
        <FinalAmountBenefit />

        {/* 결제 수단 */}
        <PaymentMethod />

        {/* 결제 동의 */}
        <PaymentAgreement />

        {/* 결제 동의 */}
        <PaymentButton />
      </DefaultLayout>
    );
  }
}

export default OrderPayment;
