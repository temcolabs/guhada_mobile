import { useState, memo } from 'react';
import { observer } from 'mobx-react';
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
function ReviewCommentSection({
  comment,
  onClickCommentSubmit,
  onClickCommentDelete,
}) {
  const { user: userStore } = useStores();
  const [mention, setMention] = useState('');
  const [mentionUserId, setMentionUserId] = useState(null);

  const userId = userStore?.userInfo?.id;

  // Submit, Delete

  // Mention event
  const onClickComment = ({ createdBy, nickname }) => {
    setMentionUserId(createdBy);
    setMention(`@[${nickname}]`);
  };

  // Clear mentions event
  const onClearMention = () => {
    setMentionUserId(null);
    setMention('');
  };

  return (
    <>
      <div>
        {/* 댓글 리스트 */}
        <CommentListSection>
          <CommentList
            userId={userId}
            comment={comment}
            onClickComment={onClickComment}
            onClickCommentDelete={onClickCommentDelete}
          />
        </CommentListSection>
        {/* 댓글 작성 */}
        <Divider />
        <CommentWriteSection>
          <CommentWrite
            mention={mention}
            mentionUserId={mentionUserId}
            onClearMention={onClearMention}
            onClickCommentSubmit={onClickCommentSubmit}
          />
        </CommentWriteSection>
      </div>
    </>
  );
}

ReviewCommentSection.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default memo(observer(ReviewCommentSection));
