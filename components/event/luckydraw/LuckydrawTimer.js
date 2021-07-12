import React from 'react';
import cn from 'classnames';
import css from './LuckydrawTimer.module.scss';
import CountdownTimer from 'lib/components/CountdownTimer';

const Digit = ({ num }) => {
  return (
    <div className={cn(css.numberBase)}>
      <div className={css.number} data-digit={num} />
    </div>
  );
};

const Colon = () => {
  return <div className={css.colon} />;
};

export default function LuckydrawTimer({
  initialTimeLeft = 0, // 남은 시간 초 단위
}) {
  return (
    <CountdownTimer
      isOn={true}
      initialTimeLeft={initialTimeLeft}
      render={({ time, hour, minute, second }) => {
        return (
          <div className={cn(css.wrap)}>
            <Digit num={hour.toString()[0]} />
            <Digit num={hour.toString()[1]} />
            <Colon />
            <Digit num={minute.toString()[0]} />
            <Digit num={minute.toString()[1]} />
            <Colon />
            <Digit num={second.toString()[0]} />
            <Digit num={second.toString()[1]} />
          </div>
        );
      }}
    />
  );
}
