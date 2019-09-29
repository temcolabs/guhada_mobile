import React from 'react';
import Head from 'next/head';
import OrderPayment from '../../template/orderpayment/OrderPayment';
import { inject, observer } from 'mobx-react';
import Loading from '../../components/common/loading/Loading';
import { getParameterByName } from '../../utils';
@inject('orderpayment')
@observer
class index extends React.Component {
  componentDidMount() {
    console.log('this page orderpayment');
    let cartList = getParameterByName('cartList');
    this.props.orderpayment.getOrderItems(cartList);
  }
  render() {
    let { orderpayment } = this.props;
    return (
      <>
        <Head>
          <title>주문 결제</title>
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
          {orderpayment.status.pageStatus ? <OrderPayment /> : <Loading />}
        </div>
      </>
    );
  }
}

export default index;
