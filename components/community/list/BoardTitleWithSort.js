import React from 'react';
import css from './BoardTitle.module.scss';

/**
 * 게시판 제목만 표시. 게시글 본문에서 사용
 */
const BoardTitleOnly = ({ children, id }) => {
  return (
    <div id={id} className={css.wrap}>
      <h2 className={css.title}>{children}</h2>
    </div>
  );
};

export default BoardTitleOnly;
