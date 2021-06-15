import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import { useScrollDirection } from 'hooks';
import { mainCategory } from 'childs/lib/constant/category';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import DefaultLayout from 'components/layout/DefaultLayout';
import Footer from 'components/footer/Footer';
import CategorySlider from 'components/common/CategorySlider';
import Ranking from 'template/Ranking';

function RankingPage() {
  /**
   * states
   */
  const { main: mainStore, ranking: rankingStore } = useStores();
  const scrollDirection = useScrollDirection();

  /**
   * side effects
   */
  useEffect(() => {
    rankingStore.fetchRanking();
  }, [rankingStore]);

  return (
    <>
      <HeadForSEO pageName="랭킹" />
      <DefaultLayout
        pageTitle={null}
        topLayout={'main'}
        scrollDirection={scrollDirection}
      >
        <CategorySlider
          categoryList={mainCategory.item}
          setNavDealId={mainStore.setNavDealId}
          scrollDirection={scrollDirection}
        />
        <Ranking />
        <Footer />
      </DefaultLayout>
    </>
  );
}

export default observer(withScrollToTopOnMount(RankingPage));
