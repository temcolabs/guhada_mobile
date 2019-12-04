import React from 'react';

export default function MypageSectionTitle({ wrapperStyle, children }) {
  return (
    <h2
      style={{
        marginTop: '0',
        marginBottom: '0',
        fontSize: '16px',
        fontWeight: 'bold',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: '1.14',
        letterSpacing: 'normal',
        textAlign: 'left',
        color: '#111',
        ...wrapperStyle,
      }}
    >
      {children}
    </h2>
  );
}
