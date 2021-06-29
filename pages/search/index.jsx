import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';
import isServer from 'childs/lib/common/isServer';
import { getLayoutInfo } from 'stores/LayoutStore';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
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
    return () => {
      searchByFilterStore.resetUnfungibles();
      searchByFilterStore.resetData();
    };
  }, []);

  /**
   * render
   */
  return (
    <>
      <HeadForSEO pageName={'검색 결과'} />
      {searchByFilterStore.isInitial && <MountLoading />}
      <Search />
    </>
  );
}

SearchPage.getInitialProps = function({ pathname, query }) {
  const initialProps = { layout: {} };

  if (isServer) {
    const { type, headerFlags } = getLayoutInfo({ pathname, query });

    initialProps.initialState = {
      layout: { type, headerFlags },
    };
  }

  return initialProps;
};

export default observer(SearchPage);
