import React from 'react';
import Head from 'next/head';
import Orderpayment from '../../template/orderpayment/Orderpayment';
import { inject, observer } from 'mobx-react';
import Loading from '../../components/common/loading/Loading';
import { getParameterByName } from '../../utils';
@inject('orderpayment')
@observer
class index extends React.Component {
  componentDidMount() {
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
        </Head>
        <div>
          {orderpayment.status.pageStatus ? <Orderpayment /> : <Loading />}
        </div>
      </>
    );
  }
}

export default index;
