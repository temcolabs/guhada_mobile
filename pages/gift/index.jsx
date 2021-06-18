import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Layout from 'components/layout/Layout';
import Footer from 'components/footer/Footer';
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
        <Gift />
        <Footer />
      </Layout>
    </>
  );
}

export default observer(GiftPage);
