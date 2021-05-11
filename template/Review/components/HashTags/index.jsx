import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'components/atoms';
import { Wrapper, Title, Contents, HashTagItem } from './Styled';

// TODO : Styled-components Sprite
const IMAGE_PATH = {
  title: '/static/icons/text/text_favorite_hashtag/text_favorite_hashtag.png',
  emoji: '/static/icons/emoji/emoji_finger_fire/emoji_finger_fire.png',
};

/**
 * ReviewHashtag
 * @param {Array} hashTags
 * @returns
 */
function ReviewHashtag({ hashTags }) {
  const onClickHashTagItem = () => {
    // TODO : 해시태그 상세 조회
    console.log('aaa');
  };
  return (
    <Wrapper>
      <Title>
        <Image src={IMAGE_PATH.title} width={'87px'} />
        <Image src={IMAGE_PATH.emoji} width={'37px'} />
      </Title>
      <Contents>
        {hashTags?.map((o) => (
          <HashTagItem key={o.id} onClick={() => onClickHashTagItem()}>
            # {o.hashtag}
          </HashTagItem>
        ))}
      </Contents>
    </Wrapper>
  );
}

ReviewHashtag.propTypes = {
  hashTags: PropTypes.array.isRequired,
};

export default ReviewHashtag;
