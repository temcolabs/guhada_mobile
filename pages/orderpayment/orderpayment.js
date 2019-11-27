import React from 'react';
import OrderPayment from '../../template/orderpayment/OrderPayment';
import { inject, observer } from 'mobx-react';
import Loading from '../../components/common/loading/Loading';
import { getParameterByName } from '../../utils';
import { devLog } from 'childs/lib/common/devLog';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

@inject('orderpayment')
@observer
class index extends React.Component {
  componentDidMount() {
    devLog('this page orderpayment');
    let cartList = getParameterByName('cartList');
    this.props.orderpayment.getOrderItems(cartList);
  }
  render() {
    let { orderpayment } = this.props;
    return (
      <>
        <HeadForSEO pageName="주문 결제" />

        <div>
          {orderpayment.status.pageStatus ? <OrderPayment /> : <Loading />}
        </div>
      </>
    );
  }
}

export default index;
