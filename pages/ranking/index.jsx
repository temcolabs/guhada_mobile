import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import isServer from 'childs/lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Layout from 'components/layout/Layout';
import Footer from 'components/footer/Footer';
import Ranking from 'template/Ranking';

function RankingPage() {
  /**
   * states
   */
  const { ranking: rankingStore } = useStores();

  /**
   * side effects
   */
  useEffect(() => {
    rankingStore.fetchRanking();
  }, [rankingStore]);

  /**
   * render
   */
  return (
    <>
      <HeadForSEO pageName="랭킹" />
      <Layout>
        <Ranking />
        <Footer />
      </Layout>
    </>
  );
}

RankingPage.getInitialProps = function({ pathname, query }) {
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

export default observer(RankingPage);
