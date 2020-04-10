import React, { useState, useEffect } from 'react';
import TimeDealSingle from 'template/event/timedeal/TimeDealSingle';
function TimedealSingle() {
  const [dev, setDev] = useState(0);
  const [local, setLocal] = useState(0);
  useEffect(() => {
    setDev(window.location.href.indexOf('dev'));
    setLocal(window.location.href.indexOf('local'));
  }, []);
  if (dev === -1 && local === -1) {
    window.location.href = '/';
  }
  return <div>{dev || local ? <TimeDealSingle /> : null}</div>;
}
export default TimedealSingle;
