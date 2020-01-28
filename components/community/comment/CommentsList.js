import React, { useEffect, useState, useContext } from 'react';
import _ from 'lodash';
import css from './CommentsList.module.scss';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import Pagination from 'components/common/Pagination';
import { useObserver } from 'mobx-react-lite';
import { useBBSStore } from 'stores/bbs';
import jumpToAnchor from 'childs/lib/dom/jumpToAnchor';
import ReportModal from 'components/claim/report/ReportModal';
import { default as reportTargetEnum } from 'childs/lib/constant/reportTarget';
import { ArticleIdContext } from 'template/community/BBSArticleView';

/**
 * 게시글의 댓글 목록
 * 게시글 아이디만 받아서 해당 글의 댓글을 렌더링한다
 */
/**
 *
 * @param {*} articleId 게시글 아이디
 * @param {*} commentCount 전체 코멘트 수
 */
const CommentsList = ({ commentCount }) => {
  const articleId = useContext(ArticleIdContext);
  const ITEMS_PER_PAGE = 10;
  const { comments: commentsStore } = useBBSStore();
  const [currentPage, setCurrentPage] = useState(1);
  const listElementId = `${articleId}-comment-list`;

  // 댓글 신고 모달 오픈 여부
  const [isCommentReportModalOpen, setIsCommentReportModalOpen] = useState(
    false
  );

  // 코멘트 신고 데이터
  const [commentReportData, setCommentReportData] = useState({
    reportTarget: reportTargetEnum.COMMENT,
    targetId: null,
  });

  // 코멘트 신고 관련 데이터
  const [commentReportRelatedData, setCommentReportRelatedData] = useState([]);

  useEffect(() => {
    // 댓글 가져오기
    commentsStore.getComments({
      communityBbsId: articleId,
      page: currentPage,
    });

    return () => {
      commentsStore.resetComments();
    };
  }, [articleId, commentsStore, currentPage]);

  /**
   * 페이지 클릭
   * @param {} page
   */
  const handleClickPage = page => {
    setCurrentPage(page);
    jumpToAnchor(listElementId);
  };

  const handleSubmitComment = ({ contents, imageList }) => {
    commentsStore.createComment({
      params: {
        isSubComment: false,
        communityBbsId: articleId,
        contents,
        imageList,
      },
    });
  };

  const handleCloseReportModal = () => {
    setIsCommentReportModalOpen(false);
  };

  /**
   * 코멘트 신고
   */
  const handleOpenReportModal = ({
    relatedData = [],
    targetId, // 코멘트 아이디
  } = {}) => {
    setIsCommentReportModalOpen(true);

    setCommentReportData({
      reportTarget: reportTargetEnum.COMMENT,
      targetId,
    });

    setCommentReportRelatedData(relatedData);
  };

  return useObserver(() => (
    <div className="wrap" id={listElementId}>
      <div className={css.commentCount}>댓글 {commentCount}</div>

      {/* 댓글 입력 */}
      <CommentInput
        key="default_comment_input"
        onSubmitComment={handleSubmitComment}
        wrapperStyle={{ marginTop: '20px' }}
      />

      {/* 댓글목록 */}
      <div>
        {commentsStore.list.map((comment, index) => {
          return (
            <CommentItem
              key={comment.id}
              comment={comment}
              commentDepth={1}
              onClickReport={handleOpenReportModal}
            />
          );
        })}
      </div>

      {commentsStore.data.totalElements > 0 && (
        <Pagination
          wrapperStyle={{ marginTop: '75px' }}
          onChangePage={handleClickPage}
          initialPage={currentPage}
          itemsCountPerPage={ITEMS_PER_PAGE}
          totalItemsCount={commentsStore.data.totalElements}
        />
      )}

      <ReportModal
        isOpen={isCommentReportModalOpen}
        onClose={handleCloseReportModal}
        reportData={commentReportData}
        relatedData={commentReportRelatedData}
      />
    </div>
  ));
};

export default CommentsList;
