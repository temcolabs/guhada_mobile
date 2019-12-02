import React from 'react';
import css from './Centering.module.scss';
import cn from 'classnames';

/**
 * 컨텐츠 센터링.
 * absolute, flex 모드 사용 가능.
 *
 * wrapperStyle로 height를 직접 지정하거나, 부모 엘레멘트가 height를 가지고 있어야 한다.
 */
export default function Centering({
  mode = 'absolute',
  wrapperStyle = { height: 'inherit' },
  children,
} = {}) {
  return (
    <div
      className={cn(css.wrap, {
        [css.absolute]: mode === 'absolute',
        [css.flex]: mode === 'flex',
      })}
      style={wrapperStyle}
    >
      <div className={css.content}>{children}</div>
    </div>
  );
}
