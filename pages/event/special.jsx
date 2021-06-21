import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import isServer from 'childs/lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Layout from 'components/layout/Layout';
import MountLoading from 'components/atoms/Misc/MountLoading';
import Footer from 'components/footer/Footer';
import SpecialList from 'template/event/SpecialList';

function SpecialPage() {
  /**
   * states
   */
  const { special: specialStore, newSpecial: newSpecialStore } = useStores();

  /**
   * side effects
   */
  useEffect(() => {
    newSpecialStore.resetSpecialData();
    if (specialStore.specialList.length === 0) {
      specialStore.getSpecialList();
    }
  }, []);

  /**
   * render
   */
  return (
    <>
      <HeadForSEO pageName="기획전" />
      <Layout>
        {specialStore.specialList.length === 0 && <MountLoading />}
        <SpecialList />
        <Footer />
      </Layout>
    </>
  );
}

SpecialPage.getInitialProps = function({ pathname, query }) {
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

export default observer(SpecialPage);
