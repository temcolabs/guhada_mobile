import React from 'react';
import Head from 'next/head';
import OrderPaymentSuccess from '../../template/orderpaymentsuccess/OrderPaymentSuccess';
import { inject, observer } from 'mobx-react';
import Loading from '../../components/common/loading/Loading';
import { getParameterByName } from '../../utils';
@inject('orderpaymentsuccess')
@observer
class index extends React.Component {
  componentDidMount() {
    let id = getParameterByName('id');
    this.props.orderpaymentsuccess.getOrderPaymentSuccessInfo(id);
  }
  render() {
    let { orderpaymentsuccess } = this.props;
    return (
      <>
        <Head>
          <title>주문 성공</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/guhada.ico"
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
