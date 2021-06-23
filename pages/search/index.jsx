import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';
import isServer from 'childs/lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Layout from 'components/layout/Layout';
import Search from 'template/Search';
import MountLoading from 'components/atoms/Misc/MountLoading';

function SearchPage() {
  /**
   * states
   */
  const { searchByFilter: searchByFilterStore } = useStores();
  const router = useRouter();

  /**
   * side effects
   */
  useEffect(() => {
    searchByFilterStore.initializePage(router.query);
    searchByFilterStore.fetchSearchResults(router.query);
  }, []);

  /**
   * render
   */
  return (
    <>
      <HeadForSEO pageName={'검색 결과'} />
      <Layout>
        {searchByFilterStore.isInitial && <MountLoading />}
        <Search />
      </Layout>
    </>
  );
}

SearchPage.getInitialProps = function({ pathname, query }) {
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

export default observer(SearchPage);
