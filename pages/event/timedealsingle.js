import React, { useEffect } from 'react';
import TimeDealSingle from 'template/event/TimeDealSingle';
function TimedealSingle() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      window.location.href = '/';
    }
  }, []);
  return (
    <div>
      {process.env.NODE_ENV === 'development' ? <TimeDealSingle /> : null}
    </div>
  );
}
export default TimedealSingle;
