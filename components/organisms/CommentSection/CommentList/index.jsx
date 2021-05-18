import { memo } from 'react';
import PropTypes from 'prop-types';
import moment, { duration } from 'moment';
import { getTimeDiff } from 'childs/lib/common/getTimeDiff';

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
import { toJS } from 'mobx';

/**
 * 댓글 리스트
 * @param {Number} userId, 사용자 ID
 * @param {Number} total, 댓글 갯수
 * @param {Array} list, 댓글 리스트
 * @returns
 */
function CommentList({
  userId,
  total,
  list,
  onClickComment,
  onClickCommentDelete,
  onClickReport,
}) {
  console.log('list : ', toJS(list));
  const convertToBoardDate = ({ createdTimestamp, currentTimestamp }) => {
    const timeStamp = getTimeDiff(currentTimestamp, createdTimestamp);
    const time = duration(timeStamp)?._data;
    const boardDate =
      (time.years > 0 && moment(createdTimestamp).format('YYYY년 MM월 dd일')) ||
      (time.days > 0 && moment(createdTimestamp).format('MM월 DD일')) ||
      (time.hours > 0 && moment(time).format('HH시간 전')) ||
      (time.minutes > 0 && moment(time).format('m분 전')) ||
      '방금 전';
    return boardDate;
  };

  return (
    <Wrapper>
      {total ? <Title>{total}</Title> : ''}
      {list && list.length ? (
        <Contents>
          {list.map((o) => (
            <ContentItem>
              <Avatar>
                <Image
                  customStyle={{ borderRadius: '50%' }}
                  width={'30px'}
                  height={'30px'}
                  src={
                    o.profileImageUrl
                      ? o.profileImageUrl
                      : '/static/icon/profile_non_square.png'
                  }
                />
              </Avatar>
              <Comment>
                <CommentName>{o.nickname}</CommentName>
                <CommentContents>{o.comment}</CommentContents>
                <CommentInfo>
                  {/* 
                        mentionUserId: 142832
                        mentionUserNickname: "옹선생님" 
                */}
                  <span>{convertToBoardDate(o)}</span>
                  <span>{' ㆍ '}댓글달기</span>
                  <span
                    onClick={() =>
                      userId === o.createdBy ? onClickCommentDelete(o.id) : onClickReport
                    }
                    style={{
                      color: userId === o.createdBy ? '#999999' : '#cccccc',
                    }}
                  >
                    {' ㆍ '}
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
    </Wrapper>
  );
}

CommentList.propTypes = {
  userId: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  list: PropTypes.array.isRequired,
  onClickComment: PropTypes.func,
  onClickReport: PropTypes.func,
  onClickDelete: PropTypes.func,
};

export default memo(CommentList);
