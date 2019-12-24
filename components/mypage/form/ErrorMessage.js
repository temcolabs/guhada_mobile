import React from 'react';

// 에러 메시지
export const ErrorMessage = ({ children, wrapperStyle = {} }) => {
  return (
    <div
      style={{
        marginTop: '7px',
        marginBottom: '5px',
        color: '#c72121',
        fontSize: '12px',
        textAlign: 'left',
        ...wrapperStyle,
      }}
    >
      {children}
    </div>
  );
};

export default ErrorMessage;
