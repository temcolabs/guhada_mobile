import React from 'react';
import css from './TextInput.module.scss';
import useChangeInput from 'hooks/useChangeInput';

export default function TextInput({
  initialValue = '',
  onChange = () => {},
  wrapperStyle = {},
  placeholder = '',
}) {
  const { value, handleChange } = useChangeInput({
    initialValue,
    onChange,
  });

  return (
    <div className={css.textInput} style={wrapperStyle}>
      <input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        type="text"
      />
    </div>
  );
}
