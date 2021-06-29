import { observer } from 'mobx-react';
import isServer from 'childs/lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Footer from 'components/footer/Footer';
import Home from 'template/Home/Home';

function HomePage() {
  /**
   * render
   */
  return (
    <>
      <HeadForSEO pageName={'키즈'} />
      <Home name={'KIDS'} />
      <Footer />
    </>
  );
}

HomePage.getInitialProps = function({ pathname, query }) {
  const initialProps = { layout: {} };

  if (isServer) {
    const { type, headerFlags } = getLayoutInfo({ pathname, query });

    initialProps.initialState = {
      layout: { type, headerFlags },
    };
  }

  return initialProps;
};

export default observer(HomePage);
