import React from 'react';
import Head from 'next/head';
import OrderPaymentSuccess from '../../template/orderpaymentsuccess/OrderPaymentSuccess';
import { inject, observer } from 'mobx-react';
import Loading from '../../components/common/loading/Loading';
import { getParameterByName } from '../../utils';
import criteoTracker from 'childs/lib/tracking/criteo/criteoTracker';
import Cookies from 'js-cookie';
import key from 'childs/lib/constant/key';
import { isBrowser } from 'childs/lib/common/isServer';
import widerplanetTracker from 'childs/lib/tracking/widerplanet/widerplanetTracker';
import daumTrakers from 'childs/lib/tracking/daum/daumTrakers';
import naverShoppingTrakers from 'childs/lib/tracking/navershopping/naverShoppingTrakers';

@inject('orderpaymentsuccess', 'user')
@observer
class index extends React.Component {
  componentDidMount() {
    let id = getParameterByName('id');
    this.props.orderpaymentsuccess
      .getOrderPaymentSuccessInfo(id)
      .then(successInfo => {
        // 로그인 상태라면 화원정보를 가져온 후에 트래커 실행. 아니면 그냥 실행
        if (isBrowser && Cookies.get(key.ACCESS_TOKEN)) {
          this.props.user.pushJobForUserInfo(userInfo => {
            this.executeTracker({ userInfo, successInfo });
          });
        } else {
          this.executeTracker({ successInfo });
        }
      });
  }

  executeTracker = ({ userInfo = {}, successInfo = {} }) => {
    // 네이버쇼핑 트래커
    naverShoppingTrakers.purchaseComplete({
      price: successInfo.totalOrderPrice,
    });

    // 다음 트래커
    daumTrakers.purchaseComplete({
      orderID: successInfo.orderNumber,
      amount: successInfo.totalOrderPrice,
    });

    // 크리테오 트래커
    criteoTracker.purchaseComplete({
      email: userInfo?.email,
      transaction_id: successInfo.orderNumber,
      items: successInfo.orderList?.map(orderItem => ({
        id: orderItem.dealId,
        price: orderItem.discountPrice,
        quantity: orderItem.quantity,
      })),
    });

    widerplanetTracker.purchaseComplete({
      userId: userInfo?.id,
      items: successInfo.orderList?.map(orderItem => ({
        i: orderItem.dealId,
        t: orderItem.prodName,
        p: orderItem.discountPrice,
        q: orderItem.quantity,
      })),
    });
  };

  render() {
    let { orderpaymentsuccess } = this.props;
    return (
      <>
        <Head>
          <title>주문 완료</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/guhada.ico"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
        </Head>
        <div>
          {orderpaymentsuccess.status.pageStatus ? (
            <OrderPaymentSuccess />
          ) : (
            <Loading />
          )}
        </div>
      </>
    );
  }
}

export default index;
