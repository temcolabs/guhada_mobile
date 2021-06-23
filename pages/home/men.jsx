import { observer } from 'mobx-react';
import isServer from 'childs/lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Layout from 'components/layout/Layout';
import Footer from 'components/footer/Footer';
import Home from 'template/Home/Home';

function HomePage() {
  /**
   * render
   */
  return (
    <>
      <HeadForSEO pageName={'남성'} />
      <Layout>
        <Home name={'MEN'} />
        <Footer />
      </Layout>
    </>
  );
}

HomePage.getInitialProps = function({ pathname, query }) {
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

export default observer(HomePage);
