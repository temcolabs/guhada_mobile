import React from 'react';
import { Image } from 'components/atoms';
import { Wrapper } from './Styled';

// TODO : Styled-components Sprite
const IMAGE_PATH = {
  title:
    '/static/icons/text/text_favorite_hashtag/text_favorite_hashtag@3x.png',
  emoji: '/static/icons/emoji/emoji_finger_fire/emoji_finger_fire@3x.png',
};

function HashtagFavoriteHeading({ headingStyles }) {
  return (
    <Wrapper style={headingStyles}>
      <Image src={IMAGE_PATH.title} width={'87px'} />
      <Image src={IMAGE_PATH.emoji} width={'37px'} />
    </Wrapper>
  );
}

HashtagFavoriteHeading.propTypes = {};

export default HashtagFavoriteHeading;
