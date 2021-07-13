import css from './Text.module.scss';
import cn from 'classnames';

/**
 * KeyValue 테이블의 value 셀에서 텍스트만 입력할 때 사용한다
 * @param {} param0
 */
export default function Text({
  children,
  wrapperStyle = {},
  hasBorder,
  disabled,
}) {
  return (
    <div
      className={cn(css.wrap, {
        [css.hasBorder]: hasBorder,
        [css.disabled]: disabled,
      })}
      style={wrapperStyle}
    >
      {children}
    </div>
  );
}
