import { observer } from 'mobx-react';
import isServer from 'lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import HeadForSEO from 'lib/components/HeadForSEO';
import Layout from 'components/layout/Layout';
import Footer from 'components/footer/Footer';
import Home from 'template/Home/Home';

function HomePage() {
  /**
   * render
   */
  return (
    <>
      <HeadForSEO pageName={'여성'} />
      <Home name={'WOMEN'} />
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
