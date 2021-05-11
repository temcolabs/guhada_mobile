import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Review from 'template/Review';
import API from 'childs/lib/API';

function ReviewPage({ banners, hashTags }) {
  return (
    <>
      <HeadForSEO pageName="리뷰" />
      <Review banners={banners} hashTags={hashTags} />
    </>
  );
}

ReviewPage.getInitialProps = async (ctx) => {
  const result = {
    banners: await getBanners(),
    hashTags: await getHashtags(),
  };

  // 리뷰 배너 정보
  async function getBanners() {
    try {
      const { data } = await API.user('/event/banner?bannerType=REVIEW');
      const result = data.data;
      return result.length ? result.deals : null;
    } catch (e) {
      console.error(e.message);
    }
  }

  // 리뷰 해시태그 정보
  async function getHashtags() {
    try {
      const { data } = await API.user('/reviews/popularity/hashtag');
      const result = data.data;
      return result.length ? result : null;
    } catch (e) {
      console.error(e.message);
    }
  }
  return result;
};

export default withScrollToTopOnMount(ReviewPage);
