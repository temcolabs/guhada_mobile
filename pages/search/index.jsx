import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import SearchLayout from 'components/layout/SearchLayout';
import Search from 'template/Search';
import MountLoading from 'components/atoms/Misc/MountLoading';
import { useScrollDown } from 'hooks';

function SearchPage() {
  /**
   * states
   */
  const {
    searchByFilter: searchByFilterStore,
    mypageRecentlySeen: mypageRecentlySeenStore,
  } = useStores();
  const router = useRouter();
  const isScrollDown = useScrollDown(60);

  /**
   * side effects
   */
  useEffect(() => {
    const {
      category,
      subcategory,
      brand,
      keyword,
      page,
      unitPerPage,
    } = router.query;
    const categoryIds = [];
    const brandIds = [];
    const searchQueries = [];
    const _page = page || 1;
    const _unitPerPage = unitPerPage || 24;

    if (category) {
      categoryIds.push(category);
    }
    if (subcategory) {
      categoryIds.push(subcategory);
    }
    if (brand) {
      brandIds.push(brand);
    }
    if (keyword) {
      searchQueries.push(keyword);
    }

    searchByFilterStore.initializeSearch(
      { categoryIds, brandIds, searchQueries },
      { page: _page, unitPerPage: _unitPerPage }
    );
  }, [searchByFilterStore, router]);

  /**
   * render
   */
  return (
    <>
      <HeadForSEO pageName={'검색 결과'} />
      <SearchLayout
        title={searchByFilterStore.searchTitle}
        back
        category
        isScrollDown={isScrollDown}
        plugins={{
          top: isScrollDown,
          kakao: true,
          history: { count: mypageRecentlySeenStore.list.length },
        }}
      >
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
