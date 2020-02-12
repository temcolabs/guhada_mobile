import React from 'react';
import css from './index.module.scss';
import { func } from 'prop-types';
function MoreButton({ getMoreContent = func.isRequired }) {
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
