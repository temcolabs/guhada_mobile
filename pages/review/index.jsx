import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import isServer from 'childs/lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Layout from 'components/layout/Layout';
import Footer from 'components/footer/Footer';
import MountLoading from 'components/atoms/Misc/MountLoading';
import Review from 'template/Review';

function ReviewPage() {
  /**
   * states
   */
  const { review: reviewStore } = useStores();

  /**
   * render
   */
  return (
    <>
      <HeadForSEO pageName="리뷰" />
      <Layout>
        {reviewStore.reviewList.length === 0 && <MountLoading />}
        <Review />
        <Footer />
      </Layout>
    </>
  );
}

ReviewPage.getInitialProps = function({ pathname, query }) {
  if (isServer) {
    const { type, headerFlags } = getLayoutInfo({ pathname, query });
    return {
      initialState: {
        layout: {
          type,
          headerFlags,
        },
      },
    };
  }
  return {};
};

export default observer(ReviewPage);
