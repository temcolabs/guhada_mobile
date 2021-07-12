import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import isServer from 'lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import HeadForSEO from 'lib/components/HeadForSEO';
import Footer from 'components/footer/Footer';
import MountLoading from 'components/atoms/Misc/MountLoading';
import TimeDeal from 'template/TimeDeal';

function TimeDealPage() {
  /**
   * states
   */
  const { timedeal: timeDealStore } = useStores();

  /**
   * side effects
   */
  useEffect(() => {
    timeDealStore.getTimeDeal();
  }, [timeDealStore]);

  /**
   * render
   */
  return (
    <>
      <HeadForSEO pageName="타임딜" />
      {!timeDealStore.timeDealStatus && <MountLoading />}
      <TimeDeal />
      <Footer />
    </>
  );
}

TimeDealPage.getInitialProps = function({ pathname, query }) {
  const initialProps = { layout: {} };

  if (isServer) {
    const { type, headerFlags } = getLayoutInfo({ pathname, query });

    initialProps.initialState = {
      layout: { type, headerFlags },
    };
  }

  return initialProps;
};

export default observer(TimeDealPage);
