import styled from 'styled-components';

/**
 * Wrapper
 */

export const ReviewHashtagModalWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(17, 17, 17, 0.7);
`;

export const Container = styled.div`
  font-family: Roboto;
  color: #111;
  padding-top: 10px;
  position: relative;
  top: 15%;
  width: 100vw;
  height: 85.9375%;
  background-color: white;
`;

/**
 * Header
 */

export const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
`;

export const HeaderFlagSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 19%;
  height: 100%;

  > span:last-child {
    font-weight: bold;
    margin-left: 15px;
  }
`;

export const HeaderInputSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 85%;
  height: 100%;

  > div:first-child {
    flex-grow: 1;
  }

  > div:last-child {
    padding: 0 20px;
  }
`;

export const HeaderInput = styled.input.attrs({ type: 'text' })`
  font-size: 15px;
  font-weight: 500;
  line-height: 1.07;
  letter-spacing: 0.45px;
  width: 100%;
`;

/**
 * Contents
 */

export const Contents = styled.div`
  padding: 20px 20px;
`;

export const ContentAutoCompleteSection = styled.div`
  padding: 15px 20px;
  font-size: 14px;
  color: #111111;
  line-height: 1.11;
`;

export const ContentsInputTagSection = styled.div`
  display: flex;
  flex-flow: row wrap;
`;
