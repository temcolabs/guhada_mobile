import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import isServer from 'lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import HeadForSEO from 'lib/components/HeadForSEO';
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
      {reviewStore.reviewList.length === 0 && <MountLoading />}
      <Review />
      <Footer />
    </>
  );
}

ReviewPage.getInitialProps = function({ pathname, query }) {
  const initialProps = { layout: {} };

  if (isServer) {
    const { type, headerFlags } = getLayoutInfo({ pathname, query });

    initialProps.initialState = {
      layout: { type, headerFlags },
    };
  }

  return initialProps;
};

export default observer(ReviewPage);
