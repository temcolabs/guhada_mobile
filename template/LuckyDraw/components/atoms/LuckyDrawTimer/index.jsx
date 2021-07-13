import PropTypes from 'prop-types';

import { Wrapper, SpanWrapper } from './Styled';

/**
 * 럭키드로우 Card > Header > Time (day, date)
 * @param {String} day
 * @param {String} date : (HH:MM:SS)
 * @param {String} text
 * @returns
 */
function LuckyDrawTimer({ day, date, text }) {
  return (
    <Wrapper>
      {text ? (
        <SpanWrapper>
          <span>{text}</span>
          <span />
        </SpanWrapper>
      ) : (
        <>
          {' '}
          <SpanWrapper>
            <span>{day}</span>
            <span>일</span>
          </SpanWrapper>
          <SpanWrapper>
            <span>{date}</span>
            <span>남음</span>
          </SpanWrapper>
        </>
      )}
    </Wrapper>
  );
}

LuckyDrawTimer.propTypes = {
  day: PropTypes.number,
  date: PropTypes.string,
};

export default LuckyDrawTimer;
