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
        marginTop: '10px',
        background: '#fff',
        border: '1px solid #eeeeee',
        padding: '40px 40px 100px',
        ...wrapperStyle,
      }}
    >
      {children}
    </div>
  );
}
