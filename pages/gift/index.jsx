import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import isServer from 'lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import HeadForSEO from 'lib/components/HeadForSEO';
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
      {giftStore.isLoading && <MountLoading />}
      <Gift />
      <Footer />
    </>
  );
}

GiftPage.getInitialProps = function({ pathname, query }) {
  const initialProps = { layout: {} };

  if (isServer) {
    const { type, headerFlags } = getLayoutInfo({ pathname, query });

    initialProps.initialState = {
      layout: { type, headerFlags },
    };
  }

  return initialProps;
};

export default observer(GiftPage);
