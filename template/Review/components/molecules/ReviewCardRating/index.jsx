import { memo } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import Image from 'components/atoms/Image';
import StarItem from 'components/mypage/review/StarItem';

import {
  Wrapper,
  LikeAndCommentSection,
  LikeSection,
  CommentSection,
  StarSection,
  Counter,
} from './Styled';

const IMAGE_PATH = {
  comment: '/public/icons/button/comment/comment@3x.png',
  likeOn: '/public/icons/button/like_on/like_on@3x.png',
  likeOff: '/public/icons/button/like_off/like_off@3x.png',
};

/**
 * 좋아요, 댓글, 별점 Section
 * @param {Object} review, review item
 * @param {Function} onClickLike, Clicked like
 * @returns
 */
function CardRating({ review, onClickLike }) {
  return (
    <Wrapper>
      <LikeAndCommentSection>
        <LikeSection
          onClick={(e) => {
            e.stopPropagation();
            onClickLike(review);
          }}
        >
          <Image
            src={
              review?.myBookmarkReview ? IMAGE_PATH.likeOn : IMAGE_PATH.likeOff
            }
            width={'17px'}
            height={'15px'}
          />
          <Counter>{review?.bookmarkCount}</Counter>
        </LikeSection>
        <CommentSection>
          <Image src={IMAGE_PATH.comment} width={'16px'} height={'16px'} />
          <Counter>{review?.commentCount}</Counter>
        </CommentSection>
      </LikeAndCommentSection>
      <StarSection>{StarItem(review?.rating)}</StarSection>
    </Wrapper>
  );
}

CardRating.propTypes = {
  review: PropTypes.object,
  onClickLike: PropTypes.func,
};

export default memo(observer(CardRating));
