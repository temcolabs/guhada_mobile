import React from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import Greeting from 'components/orderpaymentsuccess/Greeting';
import ProductInfo from 'components/orderpaymentsuccess/ProductInfo';
import OrderInfo from 'components/orderpaymentsuccess/OrderInfo';
import OrderResult from 'components/orderpaymentsuccess/OrderResult';
import BottomFixedButton from 'components/orderpaymentsuccess/BottomFixedButton';
import { inject, observer } from 'mobx-react';
import daumTrakers from 'lib/tracking/daum/daumTrakers';
import naverShoppingTrakers from 'lib/tracking/navershopping/naverShoppingTrakers';
import criteoTracker from 'childs/lib/tracking/criteo/criteoTracker';

@inject('orderpaymentsuccess', 'user')
@observer
class OrderPaymentSuccess extends React.Component {
  componentDidMount() {
    // 네이버쇼핑 트래커
    naverShoppingTrakers.purchaseComplete({
      price: this.props.orderpaymentsuccess.successInfo.totalOrderPrice,
    });
    // 다음 트래커
    daumTrakers.purchaseComplete({
      orderID: this.props.orderpaymentsuccess.successInfo.orderNumber,
      amount: this.props.orderpaymentsuccess.successInfo.totalOrderPrice,
    });

    this.props.user.pushJobForUserInfo(() => {
      // 크리테오 트래커
      criteoTracker.purchaseComplete({
        email: this.props.user.userInfo?.email,
        transaction_id: this.props.orderpaymentsuccess.successInfo.orderNumber,
        items: this.props.orderpaymentsuccess.orderSuccessProduct?.map(
          orderItem => ({
            id: orderItem.dealId,
            price: orderItem.discountPrice,
            quantity: orderItem.quantity,
          })
        ),
      });
    });
  }

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
