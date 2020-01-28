import React, { useState, useMemo, useContext } from 'react';
import css from './ArticleControlButtons.module.scss';
import ArticleBookmarkButton from 'components/community/article/ArticleBookmarkButton';
import ArticleMoreButton from 'components/community/article/ArticleMoreButton';
import ArticleShareButton from 'components/community/article/ArticleShareButton';
import { useObserver } from 'mobx-react-lite';
import { useBBSStore } from 'stores/bbs';
import qs from 'qs';
import { pushRoute, sendBackToLogin } from 'childs/lib/router';
import useStores from 'stores/useStores';
import ReportModal from 'components/claim/report/ReportModal';
import reportTarget from 'childs/lib/constant/reportTarget';
import striptags from 'striptags';
import { withRouter } from 'next/router';
import { ArticleIdContext } from 'template/community/BBSArticleView';
import ArticleLikeButton from './ArticleLikeButton';

/**
 * 게시글 본문 하단
 */
function ArticleControlButtons({ router, isModifyEnabled = true }) {
  const { alert: alertStore, login: loginStore } = useStores();
  const { article: articleStore } = useBBSStore();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const articleData = articleStore.data;
  const articleId = useContext(ArticleIdContext);

  // TODO: 좋아요 API 연동 필요
  const handleToggleLike = ({ isLikedByMe = false } = {}) => {
    if (loginStore.isLoggedIn) {
      if (!isLikedByMe) {
        articleStore.addLikeArticle({ articleId: articleData.id });
      } else {
        articleStore.removeLikeArticle({ articleId: articleData.id });
      }
    } else {
      alertStore.showAlert('로그인이 필요합니다.');
      sendBackToLogin();
    }
  };

  const handleToggleBookmark = ({ isOn = false } = {}) => {
    if (!isOn) {
      articleStore.addBookmarkToArticle({ articleId: articleData.id });
    } else {
      articleStore.removeBookmarkFromArticle({ articleId: articleData.id });
    }
  };

  const handleRedirectToEditor = () => {
    pushRoute(
      `/community/editor?${qs.stringify({
        articleId,
      })}`
    );
  };

  const handleDeleteArticle = () => {
    alertStore.showConfirm({
      content: '삭제하시겠습니까?',
      onConfirm: () => {
        articleStore.deleteArticle({
          articleData,
          onSuccess: () => {
            pushRoute(`/community/board/${articleData.categoryId}`);
          },
        });
      },
    });
  };

  const handleCloseReportModal = () => setIsReportModalOpen(false);

  /**
   * 게시글 신고.
   * 신고 모달 오픈 및 모달 데이터 초기화
   */
  const handleReportArticle = () => {
    if (loginStore.isLoggedIn) {
      setIsReportModalOpen(true);
    } else {
      sendBackToLogin();
    }
  };

  const trimmedContents = useMemo(() => {
    let trimmed = striptags(articleData.contents);
    trimmed = trimmed.length > 20 ? trimmed.slice(0, 20) + '...' : trimmed;
    return trimmed;
  }, [articleData.contents]);

  return useObserver(() => (
    <div className={css.buttonsContainer}>
      {/* TODO: 좋아요 버튼 */}
      <div className={css.buttonsContainer_leftSide}>
        <ArticleLikeButton
          likeCount={articleData.likeCount}
          isOn={articleData.like} // 내가 좋아요 했으면
          toggleLike={() => handleToggleLike({ isLikedByMe: articleData.like })}
        />
      </div>

      <div className={css.buttonsContainer_rightSide}>
        <ArticleShareButton url={articleStore.shareURL} />

        <ArticleBookmarkButton
          isOn={articleData.bookmark}
          toggleBookmark={handleToggleBookmark}
        />

        <ArticleMoreButton
          isMyArticle={articleStore.isMyArticle}
          isCreatedOnMobile={articleStore.isCreatedOnMobile}
          onModify={handleRedirectToEditor}
          onDelete={handleDeleteArticle}
          onReport={handleReportArticle}
        />
      </div>

      {/* 신고 모달 */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
        reportData={{
          reportTarget: reportTarget.BOARD,
          targetId: articleData.id,
        }}
        relatedData={[
          {
            label: '게시글번호',
            value: articleData.id,
          },
          {
            label: '게시글제목',
            value: articleData.title,
          },
          {
            label: '게시글 내용',
            value: trimmedContents,
          },
          {
            label: '작성자',
            value: articleData.createUserInfo?.nickname,
          },
        ]}
      />
    </div>
  ));
}

export default withRouter(ArticleControlButtons);
