import React, {
  useCallback,
  useReducer,
  useState,
  useEffect,
  useRef,
} from 'react';
import padZeroToSingleDigit from '../string/padZeroToSingleDigit';

const hourInSec = 60 * 60;
const minuteInSec = 60;

/**
 * 카운트다운 타이머, renderProps 패턴을 사용한다
 */
export default function CountdownTimer({
  render = ({ time }) => {},
  initialTimeLeft = 0,
  onTimeOver = () => {}, // 시간 초과했을 때 콜백
  hhmmss = false,
  isVisible = true,
}) {
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const timerId = useRef(null);

  // 초기값 설정
  useEffect(() => {
    if (initialTimeLeft >= 0) {
      setTimeLeft(initialTimeLeft);

      timerId.current = setInterval(() => {
        setTimeLeft(current => {
          const next = --current;

          // 타이머를 멈추는 로직
          if (next <= 0) {
            clearInterval(timerId.current);
            return 0;
          } else {
            return next;
          }
        });
      }, 1000);
    }

    return () => {
      clearInterval(timerId.current);
      setTimeLeft(0);
    };
  }, [initialTimeLeft]);

  useEffect(() => {
    const hour = Math.floor(timeLeft / hourInSec);
    const minute = Math.floor((timeLeft % hourInSec) / minuteInSec);
    const second = timeLeft % minuteInSec;

    dispatch({
      type: 'UPDATE',
      payload: {
        hour: padZeroToSingleDigit(hour),
        minute: padZeroToSingleDigit(minute),
        second: padZeroToSingleDigit(second),
      },
    });

    return () => {};
  }, [initialTimeLeft, timeLeft]);

  const [currentTimer, dispatch] = useReducer(
    (state, action) => {
      if (action.type === 'UPDATE') {
        return action.payload;
      } else {
        return state;
      }
    },
    {
      hour: '00',
      minute: '00',
      second: '00',
    }
  );

  const { hour, minute, second } = currentTimer;

  const formatTime = useCallback(
    (time, hhmmss) => {
      if (!!hhmmss) {
        return `${hour} : ${minute} : ${second}`;
      } else {
        return `${minute}:${second}`;
      }
    },
    [hour, minute, second]
  );

  return (
    <div>
      {render({ time: formatTime(timeLeft, hhmmss), hour, minute, second })}
    </div>
  );
}
