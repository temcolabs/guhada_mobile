import React from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import Greeting from 'components/orderpaymentsuccess/Greeting';
import ProductInfo from 'components/orderpaymentsuccess/ProductInfo';
import ShippingInfo from 'components/orderpaymentsuccess/ShippingInfo';
import OrderResult from 'components/orderpaymentsuccess/OrderResult';
import BottomFixedButton from 'components/orderpaymentsuccess/BottomFixedButton';
import { inject, observer } from 'mobx-react';
import css from './OrderPaymentSuccess.module.scss';
@inject('orderpaymentsuccess')
@observer
class OrderPaymentSuccess extends React.Component {
  render() {
    let { orderpaymentsuccess } = this.props;
    return (
      <DefaultLayout toolBar={false} pageTitle={'주문 성공'}>
        {/* 진입인사말 */}
        <Greeting />

        {/* 상품정보 */}
        <ProductInfo />

        {/* 주문정보 */}
        <ShippingInfo />

        {/* 총 주문금액 */}
        <OrderResult />

        {/* 하단 버튼 */}
        <BottomFixedButton />
      </DefaultLayout>
    );
  }
}

export default OrderPaymentSuccess;