import React from 'react';
import css from './SubmitButton.module.scss';
import cn from 'classnames';

export default function SubmitButton({
  children,
  style,
  disabled = false,
  ...rest
}) {
  return (
    <button
      type="submit"
      className={cn(css.button, { [css.isDisabled]: disabled })}
      style={style}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export function CancelButton({ children, style, ...rest }) {
  return (
    <SubmitButton
      type="button"
      style={{
        ...style,
        backgroundColor: '#444',
        borderColor: '#444',
      }}
      {...rest}
    >
      {children}
    </SubmitButton>
  );
}

/**
 * CancelButton, SubmitButton 래퍼 엘레멘트
 *
 * @param {*} responsive  SubmitButtonWrapper의 넓이에 따라 버튼의 넓이가 유동적으로 변한다. false면 버튼의 넓이가 고정
 */
export function SubmitButtonWrapper({
  responsive = false,
  fixedAtBottom = false,
  wrapperStyle = {},
  children,
  wrapperClassname,
}) {
  return (
    <div
      className={cn(css.submitButtonWrapper, wrapperClassname, {
        [css.responsive]: responsive,
        [css.fixedAtBottom]: fixedAtBottom,
      })}
      style={wrapperStyle}
    >
      {children}
    </div>
  );
}
