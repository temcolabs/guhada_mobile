import React from 'react';
import css from './MypageReviewHeading.module.scss';

export default function MypageReviewHeading({
  setSelection,
  selection,
  availableReviewCount = '0',
  reviewCount = '0',
}) {
  return (
    <div className={css.wrap}>
      <div className={css.tabWrap}>
        <div
          className={`${css.tabItem} ${
            selection === 'write' ? css.select : ''
          }`}
          onClick={() => setSelection('write')}
        >
          작성 가능한 리뷰 {availableReviewCount}개
        </div>
        <div
          className={`${css.tabItem} ${
            selection === 'modify' ? css.select : ''
          }`}
          onClick={() => setSelection('modify')}
        >
          내가 작성한 리뷰 {reviewCount}개
        </div>
      </div>
    </div>
  );
}
