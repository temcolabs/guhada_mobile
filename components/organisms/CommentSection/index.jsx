import React from 'react';
import { toJS } from 'mobx';
import useStores from 'stores/useStores';
import PropTypes from 'prop-types';

import CommentList from './CommentList';
import CommentWrite from './CommentWrite';

import { CommentListSection, CommentWriteSection, Divider } from './Styled';

/**
 * 댓글 작성 폼
 * @param {Object} comment, /reviews/${reviewId}/comments
 * @returns
 */
function CommentSection({ comment, onClickCommentSubmit, onClickCommentDelete }) {
  const { user: userStore } = useStores();

  const userId = userStore?.userInfo?.id;
  const commentList = comment?.content;

  return (
    <>
      {/* 댓글 리스트 */}
      <CommentListSection>
        <CommentList
          userId={userId}
          total={comment?.totalElements}
          list={commentList}
          onClickCommentDelete={onClickCommentDelete}
        />
      </CommentListSection>
      {/* 댓글 작성 */}
      <Divider />
      <CommentWriteSection>
        <CommentWrite onClickCommentSubmit={onClickCommentSubmit} />
      </CommentWriteSection>
    </>
  );
}

CommentSection.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default CommentSection;
