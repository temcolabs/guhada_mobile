import React from 'react';

// 에러 메시지
export const ErrorMessage = ({ children, wrapperStyle = {} }) => {
  return (
    <div
      style={{
        marginTop: '3px',
        marginBottom: '5px',
        color: '#c72121',
        fontSize: '12px',
        ...wrapperStyle,
      }}
    >
      {children}
    </div>
  );
};

export default ErrorMessage;
