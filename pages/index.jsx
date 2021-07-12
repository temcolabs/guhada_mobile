import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import isServer from 'lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import criteoTracker from 'lib/tracking/criteo/criteoTracker';
import HeadForSEO from 'lib/components/HeadForSEO';
import Footer from 'components/footer/Footer';
import Home from 'template/Home';
import NewMainStore from 'stores/NewMainStore';

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

IndexPage.getInitialProps = async function({ pathname, query }) {
  const initialProps = { layout: {} };

  const { type, headerFlags } = getLayoutInfo({ pathname, query });

  initialProps.initialState = {
    layout: { type, headerFlags },
  };

  if (isServer) {
    const { mainData } = await NewMainStore.initializeStatic();

    if (mainData) {
      initialProps.initialState.newMain = { mainData };
    }
  }

  return initialProps;
};

export default observer(IndexPage);
