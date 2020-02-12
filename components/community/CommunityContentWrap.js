import React from 'react';

export default function CommunityContentWrap({
  wrapperStyle = {},
  children,
  id,
}) {
  return (
    <div
      id={id}
      style={{
        marginTop: '24px',
        background: '#fff',
        padding: '0',
        ...wrapperStyle,
      }}
    >
      {children}
    </div>
  );
}
