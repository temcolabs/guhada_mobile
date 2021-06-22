import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import isServer from 'childs/lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import criteoTracker from 'childs/lib/tracking/criteo/criteoTracker';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Layout from 'components/layout/Layout';
import Footer from 'components/footer/Footer';
import Home from 'template/Home';

function IndexPage() {
  /**
   * states
   */
  const { user: userStore } = useStores();

  /**
   * side effects
   */
  useEffect(() => {
    criteoTracker.homepage({
      email: userStore.userInfo?.email,
    });
  }, []);

  /**
   * render
   */
  return (
    <>
      <HeadForSEO />
      <Layout>
        <Home />
        {/* <Women />
        <Men />
        <Kids /> */}
        <Footer />
      </Layout>
    </>
  );
}

IndexPage.getInitialProps = function({ pathname, query }) {
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

export default observer(IndexPage);
