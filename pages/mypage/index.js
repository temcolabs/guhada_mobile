import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import isServer from 'childs/lib/common/isServer';
import { isEmpty as _isEmpty } from 'lodash';
import { getLayoutInfo } from 'stores/LayoutStore';
import withAuth from 'components/common/hoc/withAuth';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Layout from 'components/layout/Layout';
import Footer from 'components/footer/Footer';
import MountLoading from 'components/atoms/Misc/MountLoading';
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
      <Layout title="마이페이지">
        <MyPageMain />
        <Footer />
      </Layout>
    </>
  );
}

MyPageMainPage.getInitialProps = function({ pathname, query }) {
  if (isServer) {
    const { type, headerFlags } = getLayoutInfo({ pathname, query });
    return {
      initialState: {
        layout: {
          type,
          headerFlags,
        },
      },
    };
  }
  return {};
};

export default withAuth({ isAuthRequired: true })(observer(MyPageMainPage));
