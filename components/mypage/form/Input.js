import React from 'react';
import css from './Input.module.scss';
import cn from 'classnames';
import useChangeInput from 'components/hooks/useChangeInput';
import { nilToEmptyStr } from 'childs/lib/common/nilToZero';

export const inputStatTypes = {
  NORMAL: 'normal',
  ERROR: 'error',
  OK: 'ok',
};

function Input({
  initialValue,
  onChange = value => {},
  style, // css style
  wrapperStyle,
  iconUrl, // 아이콘 타입
  iconSize, // 좌측 아이콘 크기
  status = inputStatTypes.NORMAL, // 스타일 커스터마이징을 위한 입력 상태.
  disabled,
  placeholder = '입력해주세요.',
  type,
  name,
  children, // 인풋 오른쪽 영역, 검색
  ...rest
}) {
  const { value, handleChange } = useChangeInput({
    initialValue,
    onChange,
  });

  return (
    <div
      className={cn(css.wrap, css[status], {
        [css.isDisabled]: disabled,
      })}
      style={style || wrapperStyle}
    >
      {!!iconUrl ? (
        <img
          src={iconUrl}
          style={{ width: iconSize, height: iconSize || '20px' }}
          alt={iconUrl}
        />
      ) : null}

      <input
        value={nilToEmptyStr(value)}
        onChange={e => handleChange(e.target.value)}
        disabled={disabled}
        type={type}
        placeholder={placeholder}
        name={name}
        {...rest}
      />

      {children}
    </div>
  );
}

export default Input;
