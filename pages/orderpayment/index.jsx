import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { getParameterByName } from 'lib/utils';
import useStores from 'stores/useStores';
import HeadForSEO from 'lib/components/HeadForSEO';
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
      {orderPaymentStore.status.pageStatus ? (
        <OrderPayment />
      ) : (
        <MountLoading />
      )}
    </>
  );
}

OrderPaymentPage.getInitialProps = function({ pathname, query }) {
  const initialProps = { layout: { title: '주문 결제' } };

  return initialProps;
};

export default observer(OrderPaymentPage);
