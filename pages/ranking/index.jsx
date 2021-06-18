import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
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

export default observer(withScrollToTopOnMount(RankingPage));
