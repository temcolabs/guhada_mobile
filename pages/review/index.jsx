import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Review from 'template/Review';
import API from 'childs/lib/API';

function ReviewPage({ banners }) {
  return (
    <>
      <HeadForSEO pageName="리뷰" />
      <Review banners={banners} />
    </>
  );
}

ReviewPage.getInitialProps = async (ctx) => {
  const result = {
    banners: await banners(),
  }

  // 리뷰 배너 정보
  async function banners() {
    const { data } = await API.user('/event/banner?bannerType=REVIEW');
    const result = data.data;
    return result.length ? result.deals : null;
  }

  return result;
};

export default withScrollToTopOnMount(ReviewPage);
