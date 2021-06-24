import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { getParameterByName } from '../../utils';
import useStores from 'stores/useStores';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Layout from 'components/layout/Layout';
import MountLoading from 'components/atoms/Misc/MountLoading';
import OrderPayment from 'template/orderpayment/OrderPayment';

function OrderPaymentPage() {
  /**
   * states
   */
  const { orderpayment: orderPaymentStore } = useStores();

  /**
   * side effects
   */
  useEffect(() => {
    const cartList = getParameterByName('cartList');
    orderPaymentStore.getOrderItems(cartList);
  }, []);

  /**
   * render
   */
  return (
    <>
      <HeadForSEO pageName="주문 결제" />
      <Layout title="주문 결제">
        {orderPaymentStore.status.pageStatus ? (
          <OrderPayment />
        ) : (
          <MountLoading />
        )}
      </Layout>
    </>
  );
}

export default observer(OrderPaymentPage);
