import React from 'react';

export default function withCenteredDeco(fn) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '740px',
        margin: '0 auto',
        padding: '30px',
      }}
    >
      {fn()}
    </div>
  );
}
