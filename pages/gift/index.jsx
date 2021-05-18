import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Gift from 'template/Gift';

function GiftPage() {
  return (
    <>
      <HeadForSEO pageName="선물하기" />
      <Gift />
    </>
  );
}

export default withScrollToTopOnMount(GiftPage);
