import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import RecentlyTemplate from 'template/Recently';

function RecentlyPage() {
  return (
    <>
      <HeadForSEO pageName="최근 본 상품" />
      <RecentlyTemplate />
    </>
  );
}

export default withScrollToTopOnMount(RecentlyPage);
