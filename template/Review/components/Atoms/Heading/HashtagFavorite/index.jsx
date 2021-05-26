import React from 'react';
import { Image } from 'components/atoms';
import { Wrapper } from './Styled';

// TODO : Styled-components Sprite
const IMAGE_PATH = {
  title: '/static/icons/text/text_favorite_hashtag/text_favorite_hashtag.png',
  emoji: '/static/icons/emoji/emoji_finger_fire/emoji_finger_fire.png',
};

function HashtagFavoriteHeading() {
  return (
    <Wrapper>
      <Image src={IMAGE_PATH.title} width={'87px'} />
      <Image src={IMAGE_PATH.emoji} width={'37px'} />
    </Wrapper>
  );
}

HashtagFavoriteHeading.propTypes = {};

export default HashtagFavoriteHeading;
