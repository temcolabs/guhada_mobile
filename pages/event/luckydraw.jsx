import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import isServer from 'childs/lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import { isEmpty as _isEmpty } from 'lodash';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
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
      {_isEmpty(luckyDrawStore.luckyDrawData) && <MountLoading />}
      <LuckyDraw />
      <Footer />
    </>
  );
}

LuckyDrawPage.getInitialProps = function({ pathname, query }) {
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

export default observer(LuckyDrawPage);
