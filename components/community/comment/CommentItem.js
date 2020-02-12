import React, { useState, useMemo, useContext } from 'react';
import striptags from 'striptags';
import _ from 'lodash';
import css from './CommentItem.module.scss';
import cn from 'classnames';
import CommentInput from './CommentInput';
import { useBBSStore } from 'stores/bbs';
import useStores from 'stores/useStores';
import { ArticleIdContext } from 'template/community/BBSArticleView';
import { useObserver } from 'mobx-react-lite';

/**
 * 댓글 1개
 */
const CommentItem = ({
  parentCommentId,
  commentDepth = 1,
  comment = {
    commentImageList: [],
    commentList: [],
    communityBbsId: 0,
    contents: '',
    createUserInfo: {},
    createdTimestamp: 0,
    currentTimestamp: 0,
    id: 0,
    like: false,
    likeCount: 0,
    originCommentId: null,
    originCreaterUser: null,
    originCreaterUserId: null,
    parentCommentId: null,
    userId: 0,
  },
  onClickReport = () => {},
}) => {
  const { alert, login, user } = useStores();
  const { comments: commentsStore } = useBBSStore();
  const articleId = useContext(ArticleIdContext);

  const MAX_DEPTH = 2; // 댓글 최대 중첩 레벨
  const displayDepth = Math.min(commentDepth, MAX_DEPTH); //  실제로 화면에 표시할 중첩 레벨

  const [isInputVisible, setIsInputVisible] = useState(false); // 댓글 등록 표시 여부
  const [isUpdateInputVisible, setIsUpdateInputVisible] = useState(false); // 댓글 수정 표시 여부

  const toggleInputVisible = () => {
    setIsInputVisible(!isInputVisible);
    setIsUpdateInputVisible(false);
  };

  const toggleShowModifyComment = () => {
    setIsUpdateInputVisible(!isUpdateInputVisible);
    setIsInputVisible(false);
  };

  // 내가 작성한 코멘트인지
  const isMyComment = user.userId === comment.createUserInfo?.id;

  const SUBCOMENT_PADLEFT = 40;
  const isSubComment = commentDepth > 1;

  // 댓글의 댓글
  const subCommentList = comment.commentList || [];

  // 작성자`
  const createUserInfo = comment.createUserInfo || {};

  // 원 댓글 작성자
  const originCreaterUser = comment.originCreaterUser || {};

  // 첨부 사진
  const commentImageList = comment.commentImageList || [];

  /**
   * 대댓글 등록
   */
  const handleCreateSubComment = ({ contents = '', imageList }) => {
    commentsStore.createComment({
      params: {
        isSubComment: true,
        contents,
        imageList,
        communityBbsId: articleId,
        originCommentId: comment.id, // 댓글 달 대상은 현재 코멘트
        parentCommentId: parentCommentId || comment.id,
      },
      onSuccess: () => {
        setIsInputVisible(false);
      },
    });
  };

  /**
   * 댓글 수정
   */
  const handleUpdateComment = async ({ contents = '', imageList }) => {
    try {
      await commentsStore.updateComment({
        id: comment.id,
        params: {
          isSubComment: !_.isNil(comment.originCommentId),
          contents,
          imageList: imageList.map(image => ({
            // FIXME: 이미지 업로드 결과에는 fileContentType, 댓글 이미지 데이터는 fileType
            // ! 서버에서 같은 필드명을 사용하도록 수정 요청
            fileContentType: image.fileContentType || image.fileType,
            fileName: image.fileName,
            fileSize: image.fileSize,
            imageHeight: image.imageHeight,
            imageWidth: image.imageWidth,
            url: image.url,
          })),
          communityBbsId: comment.communityBbsId,
          originCommentId: comment.originCommentId,
          parentCommentId: comment.parentCommentId,
        },
        onSuccess: () => {
          setIsUpdateInputVisible(false);
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteComment = () => {
    alert.showConfirm({
      content: '삭제하시겠습니까?',
      onConfirm: () => {
        commentsStore.deleteComment({
          id: comment.id,
        });
      },
    });
  };

  const trimmedContents = useMemo(() => {
    let trimmed = striptags(comment.contents);
    trimmed = trimmed.length > 20 ? trimmed.slice(0, 20) + '...' : trimmed;
    return trimmed;
  }, [comment.contents]);

  /**
   * 신고하기 버튼 클릭
   */
  const handleClickReport = () => {
    onClickReport({
      relatedData: [
        {
          label: '댓글 번호',
          value: comment.id,
        },
        {
          label: '댓글 내용',
          value: trimmedContents,
        },
        {
          label: '작성자',
          value: createUserInfo.nickname || createUserInfo.name,
        },
      ],
      targetId: comment.id,
    });
  };

  return useObserver(() => (
    <div key={comment.id} className={css.wrap}>
      <div
        className={css.contentsWrap}
        style={{ paddingLeft: `${(displayDepth - 1) * SUBCOMENT_PADLEFT}px` }}
      >
        <div className={css.avatar}>
          {isSubComment && <div className={css.subCommentIndicator} />}
          <div
            className={css.avatar_image}
            style={{
              backgroundImage: `url('${createUserInfo.profileImageUr ||
                '/static/icon/profile_non_square.png'}')`,
            }}
          >
            {/* TODO: 등급은 추후 추가 */}
            {/* <div className={css.avatar_memberGrade}>
              <span>1</span>
            </div> */}
          </div>
        </div>

        <div className={css.comment}>
          <div className={css.commentWrap}>
            {/* 댓글 작성자 */}
            {!comment.delete && ( // 삭제된 댓글은 타겟을 표시하지 않음.
              <div className={css.comment_nickname}>
                {createUserInfo.nickname || createUserInfo.name}

                <div className={css.timeCreatedAt}>
                  {commentsStore.getCreatedTimeWithFormat({
                    current: comment.currentTimestamp,
                    created: comment.createdTimestamp,
                  })}
                </div>
              </div>
            )}

            {/* 댓글 본문 */}
            {!isUpdateInputVisible && (
              <div>
                <div
                  className={cn(css.comment_contents, {
                    [css.isDeleted]: comment.delete,
                  })}
                >
                  {/* 최상위 댓글과 대댓글 대상이 다를 대만 타겟 닉네임 표시 */}
                  {comment.parentCommentId !== comment.originCommentId && (
                    <span className={css.comment_parentComment}>
                      @{originCreaterUser.nickname || originCreaterUser.name}
                    </span>
                  )}

                  {comment.contents}
                </div>

                {commentImageList.length > 0 && (
                  <div className={css.attachedImagesContainer}>
                    {commentImageList.map(({ url }, index) => (
                      <div
                        key={index}
                        className={css.attachedImage}
                        onClick={() => {
                          window.open(url, '_blank');
                        }}
                        style={{
                          backgroundImage: `url(${url})`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 댓글 좋아요 신고 */}
          {!comment.delete && (
            <div className={css.comment_controlButtons}>
              {login.isLoggedIn && (
                <button
                  className={css.button_showCommentInput}
                  onClick={toggleInputVisible}
                >
                  댓글달기
                </button>
              )}

              <button
                className={cn(css.button_like, {
                  [css.isOn]: comment.like,
                })}
                onClick={() => {
                  if (!comment.like) {
                    commentsStore.addLikeComment({ commentId: comment.id });
                  } else {
                    commentsStore.removeLikeComment({ commentId: comment.id });
                  }
                }}
              >
                좋아요 {comment.likeCount}
              </button>

              {isMyComment ? (
                <>
                  <button onClick={toggleShowModifyComment}>
                    {!isUpdateInputVisible ? '수정' : '수정 취소'}
                  </button>
                  <button onClick={handleDeleteComment}>삭제</button>
                </>
              ) : (
                <button
                  className={css.button_report}
                  onClick={handleClickReport}
                >
                  신고
                </button>
              )}
            </div>
          )}

          {/* 대댓글 달기 */}
          {isInputVisible && (
            <CommentInput
              wrapperStyle={{ marginTop: '30px' }}
              commentId={comment.id}
              comment={comment}
              onSubmitComment={handleCreateSubComment}
            />
          )}

          {/* 내 댓글 수정 */}
          {isMyComment && isUpdateInputVisible && (
            <CommentInput
              wrapperStyle={{ marginTop: '30px' }}
              commentId={comment.id}
              isUpdate
              onSubmitComment={handleUpdateComment}
              initialContents={comment.contents}
              initialImageList={comment.commentImageList}
            />
          )}
        </div>
      </div>

      <SubCommentList
        parentCommentId={comment.id}
        commentList={subCommentList}
        commentDepth={displayDepth + 1}
        onClickReport={onClickReport}
      />
    </div>
  ));
};

/**
 * 대댓글 목록 렌더링
 * @param {} commentList
 */
const SubCommentList = ({
  parentCommentId,
  commentList = [],
  commentDepth = 1,
  onClickReport,
}) => {
  return commentList.map((comment, index) => {
    return (
      <CommentItem
        key={`${index}-${commentDepth}`}
        parentCommentId={parentCommentId}
        comment={comment}
        commentDepth={commentDepth}
        onClickReport={onClickReport}
      />
    );
  });
};

export default CommentItem;
