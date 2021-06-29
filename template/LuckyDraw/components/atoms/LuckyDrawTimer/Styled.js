import styled from 'styled-components';

/**
 * LuckyDraw Card Timer
 */
export const Wrapper = styled.div`
  color: #fd4900;
  text-align: center;
  
  > span:first-child { margin-right: 10px; }
`;

export const SpanWrapper = styled.span`
  > span:first-child {
    font-family: 'BebasNeue-Book';
    font-size: 30px;
    line-height: 1.4;
    letter-spacing: 0.3px;
  }
  > span:last-child {
    font-size: 18px;
    line-height: 2.33;
    letter-spacing: 0.18px;
  }
`;
