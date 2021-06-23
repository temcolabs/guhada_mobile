import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import isServer from 'childs/lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Layout from 'components/layout/Layout';
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
      <Layout>
        {!timeDealStore.timeDealStatus && <MountLoading />}
        <TimeDeal />
        <Footer />
      </Layout>
    </>
  );
}

TimeDealPage.getInitialProps = function({ pathname, query }) {
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

export default observer(TimeDealPage);
