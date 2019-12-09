import React from 'react';
import css from './ClaimSuccessNotiBox.module.scss';
import isFunction from 'childs/lib/common/isFunction';

/**
 * 취소, 반품 완료 페이지 상단 알림 박스
 */
export default function ClaimSuccessNotiBox({
  heading = () => '<b>완료</b>되었습니다.', // 교환신청, 반품신청
  desc = '',
}) {
  return (
    <div className={css.wrap}>
      <h1 className={css.heading}>{heading()}</h1>
    </div>
  );
}
