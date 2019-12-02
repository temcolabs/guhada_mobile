import React from 'react';
import css from './FormButton.module.scss';
import cn from 'classnames';

export const formButtonColors = {
  DEFAULT: 'normal',
  PURPLE: 'purple',
};

/**
 * 폼 내부에서 사용되는 버튼 기본 컬러는 흰색
 */
export default function FormButton({
  color = formButtonColors.DEFAULT, // default, purple
  style = {},
  children,
  className = '',
  type = 'button', // 기본 타입을 button으로 해야 form 안에서 submit 기능을 하지 않음
  disabled = false,
  ...rest
}) {
  return (
    <button
      className={cn(css.button, css[color], className)}
      style={style}
      type={type}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
