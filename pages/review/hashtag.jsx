import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import HeadForSEO from 'components/head/HeadForSEO';
import ReviewHashtagDetail from 'template/Review/containers/HashtagDetail';

function ReviewHashtagPage() {
  return (
    <>
      <HeadForSEO pageName="리뷰" />
      <ReviewHashtagDetail />
    </>
  );
}

export default withScrollToTopOnMount(ReviewHashtagPage);
