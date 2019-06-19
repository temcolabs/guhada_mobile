import React from 'react';

export default storyFn => {
  return <div style={{ width: '375px', margin: '0 auto' }}>{storyFn()}</div>;
};
