import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 246px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Section = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
`;

export const Title = styled.div`
  color: #232323;
  font-family: BebasNeue-Bold;
  font-size: 38px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const Contents = styled.span`
  font-family: Roboto;
  font-size: 12px;
  color: #222222;

  > p:first-child {
    margin-bottom: 5px;
  }
`;
