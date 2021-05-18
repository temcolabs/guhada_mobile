import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Ranking from 'template/Ranking';

function RankingPage() {
  return (
    <>
      <HeadForSEO pageName="랭킹" />
      <Ranking />
    </>
  );
}

export default withScrollToTopOnMount(RankingPage);
