import { useMemo } from 'react';
import useBBSSearchState from 'components/community/list/useBBSSearchState';
import { withRouter } from 'next/router';
import { useBBSStore } from 'stores/bbs';
import searchOrder, {
  searchOrderOptions,
} from 'lib/constant/community/searchOrder';
import SortButton from './SortButton';
import css from './BoardTitle.module.scss';
import BoardCategoryFilter from 'components/community/list/BoardCategoryFilter';
/**
 * 게시판 목록에서 사용. 우측에 정렬 버튼 있음.
 * @param {*} param0
 */
const BoardTitle = ({ router = {}, children, id, isSortVisible = true }) => {
  const {
    searchQuery,
    handleChangeOrder,
    POPULAR_CATEGORY_ID,
  } = useBBSSearchState({
    query: router.query,
    asPath: router.asPath,
  });
  const { categoryFilter: categoryFilterStore } = useBBSStore();
  const orderOptionsFiltered = useMemo(() => {
    // 인기글 메뉴에서는 정렬 변경이 불가능하다.
    if (searchQuery.categoryId === POPULAR_CATEGORY_ID) {
      return [];
    } else {
      return searchOrderOptions;
    }
  }, [POPULAR_CATEGORY_ID, searchQuery.categoryId]);

  return (
    <div id={id} className={css.wrap}>
      <div className={css.categoryFilter}>
        <BoardCategoryFilter
          order={searchQuery.order}
          onChange={handleChangeOrder}
          options={orderOptionsFiltered}
        />
      </div>

      {isSortVisible && (
        <div className={css.sortButtonWrapper}>
          <SortButton
            placeholder="정렬"
            initialValue={searchQuery.order}
            options={orderOptionsFiltered}
            onChange={handleChangeOrder}
          />
        </div>
      )}
    </div>
  );
};

export default withRouter(BoardTitle);
