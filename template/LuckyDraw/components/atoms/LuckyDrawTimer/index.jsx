import PropTypes from 'prop-types';
import css from './LuckyDrawTimer.module.scss';

/**
 * 럭키드로우 Card > Header > Time (day, date)
 * @param {String} day
 * @param {String} date : (HH:MM:SS)
 * @param {String} text
 * @returns
 */
function LuckyDrawTimer({ day, date, text }) {
  return (
    <div className={css.wrapper}>
      {text ? (
        <span className={css.spanWrapper}>
          <span>{text}</span>
          <span />
        </span>
      ) : (
        <>
          {' '}
          <span className={css.spanWrapper}>
            <span>{day}</span>
            <span>일</span>
          </span>
          <span className={css.spanWrapper}>
            <span>{date}</span>
            <span>남음</span>
          </span>
        </>
      )}
    </div>
  );
}

LuckyDrawTimer.propTypes = {
  day: PropTypes.number,
  date: PropTypes.string,
};

export default LuckyDrawTimer;
