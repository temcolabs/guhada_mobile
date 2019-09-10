import React, { useState, useEffect, useCallback, useRef } from 'react';
import prependZero from 'lib/string/prependZero';

/**
 * 카운트다운 타이머, renderProps 패턴을 사용한다
 */
export default function CountdownTimer({
  render = ({ time }) => {},
  isOn = false,
  initialTimeLeft = 0,
  onTimeOver = () => {}, // 시간 초과했을 때 콜백
}) {
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const timerId = useRef(null);

  /**
   * 타이머 시작
   * @param {number} time 남은 시간
   */
  const startTimer = useCallback(
    time => {
      clearInterval(timerId.current);

      if (time > 0) {
        let nextTimeLeft = time;

        timerId.current = setInterval(() => {
          nextTimeLeft -= 1;
          if (nextTimeLeft >= 0) {
            setTimeLeft(nextTimeLeft);
          } else {
            clearInterval(timerId.current);
            onTimeOver();
          }
        }, 1000);
      }
    },
    [onTimeOver]
  );

  // 타이머 온 여부가 변경되면 타이머를 재시작한다
  useEffect(() => {
    clearInterval(timerId.current);

    startTimer(initialTimeLeft);

    return () => {
      clearInterval(timerId.current);
    };
  }, [initialTimeLeft, isOn, startTimer]);

  const formatTime = time => {
    if (!!time) {
      const minutes = parseInt(time / 60);
      const seconds = time % 60;

      return `${prependZero(minutes)}:${prependZero(seconds)}`;
    } else {
      return '00:00';
    }
  };

  return <div>{render({ time: formatTime(timeLeft) })}</div>;
}
