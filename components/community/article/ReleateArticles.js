import React from 'react';
import CommunityContentWrap from 'components/community/CommunityContentWrap';
import Pagination from 'components/common/Pagination';
import BoardListItem from 'components/community/list/BoardListItem';

const ReleateArticles = () => {
  /**
   * 관련글 페이지 클릭
   * * 관련글 페이지네이션은 쿼리스트링으로 하지 않음
   */
  const handleClickRelatedListPage = () => {};

  return (
    <CommunityContentWrap key="related_articles">
      {[1, 1, 1, 1].map((_, index) => {
        return <BoardListItem key={index} />;
      })}

      {/* <Pagination
      wrapperStyle={{ marginTop: '75px' }}
      onChangePage={handleClickRelatedListPage}
      initialPage={state.relatedListPage}
      itemsCountPerPage={state.relatedItemsPerPage}
      totalItemsCount={200} // FIXME:
    /> */}
    </CommunityContentWrap>
  );
};

export default ReleateArticles;
