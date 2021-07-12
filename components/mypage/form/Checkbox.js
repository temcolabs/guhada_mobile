import React from 'react';
import css from './Checkbox.module.scss';
import cn from 'classnames';
import useChangeInput from 'hooks/useChangeInput';

export default function Checkbox({
  initialValue = false,
  name = '',
  onChange = (v) => {}, // (v: boolean) => any
  icon = '',
  children,
  disabled = false,
  fixed = false, // 값이 초기값에서 변하지 않도록 한다
}) {
  const id = `checkbox_${name}`.replace(/\s+/, '_');
  const { value, handleChange } = useChangeInput({ initialValue, onChange });
  return (
    <div
      className={cn(css.wrap, css[icon], {
        [css.fixed]: fixed,
      })}
    >
      <input
        id={id}
        type="checkbox"
        checked={fixed ? initialValue : value}
        onChange={(e) => {
          handleChange(e.target.checked);
        }}
        disabled={disabled}
      />
      <label htmlFor={id}>{children || name}</label>
    </div>
  );
}
