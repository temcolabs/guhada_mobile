import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import css from './BBSArticleView.module.scss';
import DefaultLayout from 'components/layout/DefaultLayout';
import ArticleControlButtons from 'components/community/article/ArticleControlButtons';
import ArticleTitle from 'components/community/article/ArticleTitle';
import AdBanner from 'components/community/AdBanner';
import CommentsList from 'components/community/comment/CommentsList';
import CommunityContentWrap from 'components/community/CommunityContentWrap';
import { useBBSStore } from 'stores/bbs';
import { withRouter } from 'next/router';
import { compose } from 'lodash/fp';
import ArticleContents from 'components/community/article/ArticleContents';
import useStores from 'stores/useStores';
import useBBSSearchState from 'components/community/list/useBBSSearchState';
import { pushRoute } from 'childs/lib/router';
import RelatedArticleList from 'components/community/article/RelatedArticleList';
import BoardSearch from 'components/community/list/BoardSearch';
import Footer from 'components/footer/Footer';
const enhancer = compose(
  withRouter,
  observer
);

export const ArticleIdContext = React.createContext(null);

/**
 * 게시판 글보기
 */
const BBSArticleView = enhancer(({ router }) => {
  const { alert } = useStores();
  const { article: articleStore } = useBBSStore();
  const articleId = router.query?.id;
  const { ALL_CATEGORY_ID } = useBBSSearchState({
    query: router.query,
    asPath: router.asPath,
  });

  // 게시글 가져오기
  useEffect(() => {
    articleStore.getArticle({
      id: articleId,
    });

    return () => {
      articleStore.initArticleData();
    };
  }, [articleStore, articleId]);

  const { searchQuery, handleSubmitSearch } = useBBSSearchState({
    query: router.query,
    asPath: router.asPath,
  });

  const {
    categoryId,
    categoryFilterId,
    title,
    commentCount,
    hitCount,
    likeCount,
    createdTimestamp,
    createUserInfo = {},
    delete: isDeleted,
  } = articleStore.data;

  const {
    categoryFilter: categoryFilterStore,
    search: searchStore,
  } = useBBSStore();
  const [categoryFilterName, setCategoryFilterName] = useState('');

  // 게시글의 카테고리 설정
  useEffect(() => {
    categoryFilterStore.getCategoryFilters(categoryId);
  }, [categoryFilterStore, categoryId]);

  // 게시글의 카테고리필터 아이디로 필터 이름을 가져온다
  useEffect(() => {
    setCategoryFilterName(
      categoryFilterStore.getCategoryFilterById(categoryFilterId)?.name || null
    );
  }, [
    categoryFilterId,
    categoryFilterStore,
    categoryFilterStore.categoryFilters,
  ]);

  const isArticleDeleted = isDeleted === true;

  useEffect(() => {
    if (isArticleDeleted) {
      alert.showAlert({
        content: '삭제된 글입니다',
        onConfirm: () => {
          pushRoute(`/community/board/${ALL_CATEGORY_ID}`);
        },
      });
    }
  }, [alert, ALL_CATEGORY_ID, isArticleDeleted, router]);

  const isArticleVisible = articleStore.isArticleFetched && !isArticleDeleted;

  return (
    <ArticleIdContext.Provider value={articleId}>
      <DefaultLayout
        pageTitle={articleStore.articleCategoryName}
        kakaoChat={false}
        toolBar={true}
        headerShape={'BBSArticleView'}
      >
        {/* 게시글 */}
        {isArticleVisible && (
          <div className={css.wrap}>
            <CommunityContentWrap key="article">
              {/* <BoardTitleOnly isSortVisible={false}>
                {articleStore.articleCategoryName}
              </BoardTitleOnly> */}
              <article>
                {/* 제목 영역 */}
                <ArticleTitle
                  title={title}
                  categoryFilterName={categoryFilterName}
                  commentCount={commentCount}
                  hitCount={hitCount}
                  likeCount={likeCount}
                  createdTimestamp={createdTimestamp}
                  userName={createUserInfo?.nickname || createUserInfo?.name}
                />

                <div className={css.contentWrapper}>
                  {/* 게시글 본문 */}
                  <ArticleContents
                    isCreatedOnMobile={articleStore.isCreatedOnMobile}
                    contents={articleStore.contents}
                  />

                  {/* 하단 버튼 영역*/}
                  <ArticleControlButtons />
                </div>

                {/* 광고 */}
                <AdBanner />

                {/* 댓글 영역 */}
                <div className={css.commentWrapper}>
                  <CommentsList commentCount={commentCount} />
                </div>
              </article>
            </CommunityContentWrap>

            <RelatedArticleList
              articleId={articleStore.data?.id}
              lastSearchQuery={searchStore.searchQuery} // 목록에서 실행한 검색 쿼리
              lastCategoryId={searchStore.searchQuery?.categoryId || categoryId} // 검색결과의 카테고리 아이디 또는 게시글의 카테고리아이디
              lastPage={searchStore.searchQuery?.page || 1} // 검색 결과의 페이지 번호 또는 1
            />

            {/* 검색어 입력  */}
            {!searchStore.isFetching && (
              <div className={css.boardSearchWrap}>
                <BoardSearch
                  onSubmitSearch={handleSubmitSearch}
                  initialSearchType={searchQuery.searchType}
                  initialQuery={searchQuery.query}
                />
              </div>
            )}

            <Footer />
          </div>
        )}
      </DefaultLayout>
    </ArticleIdContext.Provider>
  );
});

export default BBSArticleView;
