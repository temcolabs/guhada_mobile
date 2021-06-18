import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import isServer from 'childs/lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Layout from 'components/layout/Layout';
import Footer from 'components/footer/Footer';
import MountLoading from 'components/atoms/Misc/MountLoading';
import Gift from 'template/Gift';

function GiftPage() {
  /**
   * states
   */
  const { gift: giftStore } = useStores();

  /**
   * side effects
   */
  useEffect(() => {
    giftStore.fetchDeals();
  }, [giftStore]);

  /**
   * render
   */
  return (
    <>
      <HeadForSEO pageName="선물하기" />
      <Layout>
        {giftStore.isLoading && <MountLoading />}
        <Gift />
        <Footer />
      </Layout>
    </>
  );
}

GiftPage.getInitialProps = function({ pathname, query }) {
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

export default observer(GiftPage);
