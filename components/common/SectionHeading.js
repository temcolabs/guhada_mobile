import React from 'react';
import css from './SectionHeading.module.scss';
import classnames from 'classnames';

/**
 * 섹션 제목. 하단 보더라인 있음. 옵션에 따라 숨기고 보일 수 있음.
 * 제목영역에는 텍스트 또는 컴포넌트 넣을 수 있음.
 */
export default function SectionHeading({
  title = 'title',
  isBorderHidden = false,
  children,
  wrapperStyle = {},
}) {
  return (
    <div className={classnames(css.wrap)} style={wrapperStyle}>
      <h2
        className={classnames(css.title, {
          [css.isBorderHidden]: isBorderHidden,
        })}
      >
        {typeof title === 'function' ? title() : title}
      </h2>

      {children && <div className={css.children}>{children}</div>}
    </div>
  );
}
