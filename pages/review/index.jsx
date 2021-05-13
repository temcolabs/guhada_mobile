import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Review from 'template/Review';

function ReviewPage() {
  return (
    <>
      <HeadForSEO pageName="리뷰" />
      <Review />
    </>
  );
}

export default withScrollToTopOnMount(ReviewPage);
