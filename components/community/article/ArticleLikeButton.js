import { useState } from 'react';
import css from './ArticleLikeButton.module.scss';
import cn from 'classnames';

const ArticleLikeButton = ({
  toggleLike = () => {},
  likeCount = 0, // 좋아요 수
  isOn = false, // 내가 좋아요 눌렀는지 여부
}) => {
  return (
    <button
      className={cn({ [css.isOn]: isOn }, css.button)}
      onClick={() => toggleLike({ isOn })}
    >
      {likeCount}
    </button>
  );
};

export default ArticleLikeButton;
