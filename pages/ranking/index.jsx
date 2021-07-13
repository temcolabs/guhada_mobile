import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import isServer from 'lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import HeadForSEO from 'components/head/HeadForSEO';
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
      <Ranking />
      <Footer />
    </>
  );
}

RankingPage.getInitialProps = function({ pathname, query }) {
  const initialProps = { layout: {} };

  if (isServer) {
    const { type, headerFlags } = getLayoutInfo({ pathname, query });

    initialProps.initialState = {
      layout: { type, headerFlags },
    };
  }

  return initialProps;
};

export default observer(RankingPage);
