import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import isServer from 'childs/lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import { isEmpty as _isEmpty } from 'lodash';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Layout from 'components/layout/Layout';
import Footer from 'components/footer/Footer';
import MountLoading from 'components/atoms/Misc/MountLoading';
import LuckyDraw from 'template/LuckyDraw';

function LuckyDrawPage() {
  /**
   * states
   */
  const { luckyDraw: luckyDrawStore } = useStores();

  /**
   * side effects
   */
  useEffect(() => {
    luckyDrawStore.getLuckyDrawList();
    luckyDrawStore.initLuckyEventData();
  }, [luckyDrawStore]);

  /**
   * render
   */
  return (
    <>
      <HeadForSEO
        pageName="럭키드로우"
        image={`${
          process.env.API_CLOUD
        }/images/thumbnail/luckydraw/thumbnail_luckydraw.png`}
      />
      <Layout>
        {_isEmpty(luckyDrawStore.luckyDrawData) && <MountLoading />}
        <LuckyDraw />
        <Footer />
      </Layout>
    </>
  );
}

LuckyDrawPage.getInitialProps = function({ pathname, query }) {
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

export default observer(LuckyDrawPage);
