import React from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import Greeting from 'components/orderpaymentsuccess/Greeting';
import ProductInfo from 'components/orderpaymentsuccess/ProductInfo';
import OrderInfo from 'components/orderpaymentsuccess/OrderInfo';
import OrderResult from 'components/orderpaymentsuccess/OrderResult';
import BottomFixedButton from 'components/orderpaymentsuccess/BottomFixedButton';
import { inject, observer } from 'mobx-react';

@inject('orderpaymentsuccess', 'user')
@observer
class OrderPaymentSuccess extends React.Component {
  render() {
    return (
      <DefaultLayout
        toolBar={false}
        headerShape={'ordersuccess'}
        pageTitle={'주문 완료'}
      >
        {/* 진입인사말 */}
        <Greeting />

        {/* 상품정보 */}
        <ProductInfo />

        {/* 주문정보 */}
        <OrderInfo />

        {/* 총 주문금액 */}
        <OrderResult />

        {/* 하단 버튼 */}
        <BottomFixedButton />
      </DefaultLayout>
    );
  }
}

export default OrderPaymentSuccess;
