import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import SearchLayout from 'components/layout/SearchLayout';
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
  }, []);

  /**
   * render
   */
  return (
    <>
      <HeadForSEO pageName={'검색 결과'} />
      <SearchLayout>
        {searchByFilterStore.isInitial && <MountLoading />}
        <Search />
      </SearchLayout>
    </>
  );
}

// SearchPage.getInitialProps = async function({ req, query }) {
//   if (isServer) {
//     try {
//       return {
//         initialState: {},
//       };
//     } catch (error) {
//       console.error(error.message);
//       return {};
//     }
//   }
//   return {};
// };

export default observer(SearchPage);
