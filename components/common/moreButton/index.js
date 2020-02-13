import React from 'react';
import css from './index.module.scss';
function MoreButton({ getMoreContent }) {
  return (
    <div
      className={css.more}
      onClick={() => {
        getMoreContent();
      }}
    >
      더 보기
      <i className={css.detailBtn} />
    </div>
  );
}
export default MoreButton;
