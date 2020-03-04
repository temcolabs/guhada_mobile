import React from 'react';
import css from './SubmitButton.module.scss';

export default function SubmitButton({ children, style, ...rest }) {
  return (
    <button type="submit" className={css.button} style={style} {...rest}>
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

export function SubmitButtonWrapper({ wrapperStyle, children }) {
  return <div style={{ ...wrapperStyle, textAlign: 'center' }}>{children}</div>;
}
