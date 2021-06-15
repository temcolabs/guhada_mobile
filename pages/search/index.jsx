import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import SearchLayout from 'components/layout/SearchLayout';
import Search from 'template/Search';
import MountLoading from 'components/atoms/Misc/MountLoading';

/** body props to compare with `defaultBody` to check if initializing is needed */
const comparedBodyProps = [
  'categoryIds',
  'brandIds',
  'searchQueries',
  'searchCondition',
];

function SearchPage() {
  /**
   * states
   */
  const {
    searchByFilter: searchByFilterStore,
    layout: layoutStore,
  } = useStores();
  const router = useRouter();

  /**
   * side effects
   */
  useEffect(() => {
    searchByFilterStore.fetchSearchResults(router.query, comparedBodyProps);

    const { category, brand, keyword } = router.query;
    let type = 'default';
    if (keyword) {
      type = 'keyword';
    } else if (brand) {
      type = 'brand';
    } else if (category) {
      type = 'category';
    }
    layoutStore.initialize(type);
  }, [searchByFilterStore, layoutStore, router]);

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
