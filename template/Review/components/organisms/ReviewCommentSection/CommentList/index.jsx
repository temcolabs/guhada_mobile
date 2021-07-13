import { memo, useState } from 'react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import moment, { duration } from 'moment';
import { getTimeDiff } from 'lib/common/getTimeDiff';
import { default as reportTargetEnum } from 'lib/constant/reportTarget';

import Image from 'components/atoms/Image';
import {
  Wrapper,
  Title,
  Contents,
  ContentItem,
  Avatar,
  Comment,
  CommentName,
  CommentContents,
  CommentInfo,
} from './Styled';

const ReportModal = dynamic(
  () => import('components/claim/report/ReportModal'),
  { ssr: false }
);

const MENTION_STYLES = {
  color: '#024793',
  fontWeight: 'bold',
  width: '100%',
};

/**
 * 댓글 리스트
 * @param {Number} userId, 사용자 ID
 * @param {Object} comment, {totalElements, content}
 * @param {Array} onClickComment, 댓글 리스트
 * @param {Array} onClickCommentDelete, 댓글 삭제
 * @returns
 */
function CommentList({
  userId,
  comment,
  onClickComment,
  onClickCommentDelete,
}) {
  // 댓글 신고 모달 오픈 여부
  const [isCommentReportModalOpen, setIsCommentReportModalOpen] = useState(
    false
  );

  // 코멘트 신고 관련 데이터
  const [commentReportRelatedData, setCommentReportRelatedData] = useState([]);

  // 코멘트 신고 데이터
  const [commentReportData, setCommentReportData] = useState({
    reportTarget: reportTargetEnum.COMMENT,
    targetId: null,
  });

  const total = comment?.totalElements;
  const comments = comment?.content;

  /**
   * 신고하기 이벤트
   * @param {Object} item, comment item
   */
  const onClickCommentReport = (item) => {
    setCommentReportData({ ...commentReportData, targetId: item.id });
    setCommentReportRelatedData([
      {
        label: '댓글 번호',
        value: item?.id,
      },
      {
        label: '댓글 내용',
        value: item?.comment,
      },
      {
        label: '작성자',
        value: item?.nickname,
      },
    ]);
    setIsCommentReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsCommentReportModalOpen(false);
  };

  /**
   * 댓글 스타일 수정 (Mention)
   * @param {Number} mentionUserId 대댓글 유무
   * @param {String} comment 댓글
   * @returns
   */
  const convertToComment = ({ mentionUserId, comment }) => {
    let result = null;
    if (mentionUserId) {
      const prefix = comment.indexOf('@');
      const suffix = comment.indexOf(' ');
      let target = comment
        .slice(prefix, suffix)
        .replace('[', '')
        .replace(']', '');
      comment = comment.slice(suffix, comment.length);
      result = (
        <>
          <span style={MENTION_STYLES}>{target}</span>
          {comment}
        </>
      );
    } else result = comment;
    return result;
  };

  /**
   * 게시글 작성 시간
   * @param {Number} createdTimestamp
   * @param {Number} currentTimestamp
   * @returns
   */
  const convertToBoardDate = ({ createdTimestamp, currentTimestamp }) => {
    const timeStamp = getTimeDiff(currentTimestamp, createdTimestamp);
    const time = duration(timeStamp)?._data;
    const boardDate =
      (time.years > 0 && moment(createdTimestamp).format('YYYY년 MM월 dd일')) ||
      (time.days > 0 && moment(createdTimestamp).format('MM월 DD일')) ||
      (time.hours > 0 && moment(time).format('H시간 전')) ||
      (time.minutes > 0 && moment(time).format('m분 전')) ||
      '방금 전';
    return boardDate;
  };

  return (
    <Wrapper>
      {total ? <Title>{total}</Title> : ''}
      {comments && comments.length ? (
        <Contents>
          {comments.map((o) => (
            <ContentItem>
              <Avatar>
                <Image
                  customStyle={{ borderRadius: '50%' }}
                  width={'30px'}
                  height={'30px'}
                  src={
                    o.profileImageUrl
                      ? o.profileImageUrl
                      : '/public/icon/profile_non_square.png'
                  }
                />
              </Avatar>
              <Comment>
                <CommentName>{o.nickname}</CommentName>
                <CommentContents>{convertToComment(o)}</CommentContents>
                <CommentInfo>
                  <span>{convertToBoardDate(o)}</span>
                  <span onClick={() => onClickComment(o)}>댓글달기</span>
                  <span
                    onClick={() =>
                      userId === o.createdBy
                        ? onClickCommentDelete(o.id)
                        : onClickCommentReport(o)
                    }
                    style={{
                      color: userId === o.createdBy ? '#999999' : '#cccccc',
                    }}
                  >
                    {userId === o.createdBy ? '삭제' : '신고'}
                  </span>
                </CommentInfo>
              </Comment>
            </ContentItem>
          ))}
        </Contents>
      ) : (
        ''
      )}

      {isCommentReportModalOpen && (
        <ReportModal
          isOpen={isCommentReportModalOpen}
          onClose={handleCloseReportModal}
          reportData={commentReportData}
          relatedData={commentReportRelatedData}
        />
      )}
    </Wrapper>
  );
}

CommentList.propTypes = {
  userId: PropTypes.number,
  comment: PropTypes.shape({
    totalElements: PropTypes.number,
    content: PropTypes.object,
  }),
  onClickComment: PropTypes.func.isRequired,
  onClickCommentDelete: PropTypes.func.isRequired,
};

export default memo(CommentList);
