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
import daumTracker from 'childs/lib/tracking/daum/daumTracker';
import kochavaTracker from 'childs/lib/tracking/kochava/kochavaTracker';
import naverShoppingTrakers from 'childs/lib/tracking/navershopping/naverShoppingTrakers';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import momentTracker from 'childs/lib/tracking/kakaomoment/momentTracker';
import ReactPixel from 'react-facebook-pixel';
import gtagTracker from 'childs/lib/tracking/google/gtagTracker';

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
    daumTracker.purchaseComplete({
      orderID: successInfo.orderNumber,
      amount: successInfo.totalOrderPrice,
    });

    // 카카오 모먼트 트래커
    momentTracker.purchaseComplete();

    // gtag 트래커
    gtagTracker.purchaseComplete();

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

    kochavaTracker.purchaseComplete({ successInfo });

    ReactPixel.track('Purchase', {
      value: successInfo.totalOrderPrice,
      currency: 'KRW',
    });
  };

  render() {
    let { orderpaymentsuccess } = this.props;
    return (
      <>
        <HeadForSEO pageName="주문 완료" />

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
