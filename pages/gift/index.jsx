import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';

import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Gift from 'template/Gift';

import { isBrowser } from 'childs/lib/common/isServer';

GiftPage.getInitialProps = function(ctx) {
  if (isBrowser) {
    console.log('yoman BROWSER!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  } else {
    console.log('yoman SERVER!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  }

  return {};
};
function GiftPage() {
  return (
    <>
      <HeadForSEO />
      <Gift />
    </>
  );
}

export default withScrollToTopOnMount(GiftPage);
