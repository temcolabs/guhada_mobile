import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import isServer from 'childs/lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import criteoTracker from 'childs/lib/tracking/criteo/criteoTracker';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
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
      <Home />
      <Footer />
    </>
  );
}

IndexPage.getInitialProps = function({ pathname, query }) {
  const initialProps = { layout: {} };

  if (isServer) {
    const { type, headerFlags } = getLayoutInfo({ pathname, query });
    Object.assign(initialProps, {
      initialState: {
        layout: {
          type,
          headerFlags,
        },
      },
    });
  }

  return initialProps;
};

export default observer(IndexPage);
