import styled from 'styled-components';

export const Wrapper = styled.div`
  font-family: Roboto;
  font-weight: 500;
  margin: 30px 20px;
  height: 100%;
`;

export const Title = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  height: 20px;
  margin-bottom: 15px;

  > div:first-child {
    margin-right: 7px;
  }
`;

export const Contents = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

export const HashTagItem = styled.button`
  background-color: #f9f9fa;
  color: #777;
  padding: 7px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  line-height: 1.29;
  height: 30px;
  margin-right: 7px;
`;
