import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import isServer from 'lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import withAuth from 'components/common/hoc/withAuth';
import HeadForSEO from 'lib/components/HeadForSEO';
import Footer from 'components/footer/Footer';
import MyPageMain from 'template/mypage/main';

function MyPageMainPage() {
  /**
   * states
   */
  const {
    mypageDashboard: mypageDashboardStore,
    orderCompleteList: orderCompleteListStore,
  } = useStores();

  /**
   * side effects
   */
  useEffect(() => {
    mypageDashboardStore.getDashboard(); // 쿠폰, 포인트, 토큰
    orderCompleteListStore.getMyOrderStatus(); // 주문 배송
    return () => {
      mypageDashboardStore.resetData();
    };
  }, []);

  /**
   * render
   */
  return (
    <>
      <HeadForSEO pageName="마이페이지" />
      <MyPageMain />
      <Footer />
    </>
  );
}

MyPageMainPage.getInitialProps = function({ pathname, query }) {
  const initialProps = { layout: { title: '마이페이지' } };

  if (isServer) {
    const { type, headerFlags } = getLayoutInfo({ pathname, query });

    initialProps.initialState = {
      layout: { type, headerFlags },
    };
  }

  return initialProps;
};

export default withAuth({ isAuthRequired: true })(observer(MyPageMainPage));
