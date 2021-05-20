import React, { useState } from 'react';
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
function CommentSection({
  comment,
  onClickCommentSubmit,
  onClickCommentDelete,
}) {
  const { user: userStore } = useStores();
  const [mention, setMention] = useState('');
  const [mentionUserId, setMentionUserId] = useState(0);

  const userId = userStore?.userInfo?.id;
  const commentList = comment?.content;

  // Submit, Delete

  // Mention event
  const onClickComment = ({ createdBy, nickname, mentionUserId }) => {
    setMentionUserId(mentionUserId);
    setMention(`@[${nickname}](${createdBy})`);
  };

  // Clear mentions event
  const onClearMention = () => setMention('');

  return (
    <>
      <div>
        {/* 댓글 리스트 */}
        <CommentListSection>
          <CommentList
            userId={userId}
            total={comment?.totalElements}
            list={commentList}
            onClickComment={onClickComment}
            onClickCommentDelete={onClickCommentDelete}
          />
        </CommentListSection>
        {/* 댓글 작성 */}
        <Divider />
        <CommentWriteSection>
          <CommentWrite
            mention={mention}
            onClearMention={onClearMention}
            onClickCommentSubmit={onClickCommentSubmit}
          />
        </CommentWriteSection>
      </div>
    </>
  );
}

CommentSection.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default CommentSection;
