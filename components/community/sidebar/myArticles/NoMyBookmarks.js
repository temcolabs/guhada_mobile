import React from 'react';
import css from './NoMyActivity.module.scss';

export default function NoMyBookmarks() {
  return (
    <div className={css.wrap}>
      <img
        src="/public/icon/community/icon-bookmark-non@3x.png"
        alt="icon-bookmark-non@3x.png"
        className={css.notiImage}
      />
      <div className={css.notiText}>북마크 한 글이 없습니다.</div>
    </div>
  );
}
