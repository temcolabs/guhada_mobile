import styled from 'styled-components';

export const Wrapper = styled.div`
  font-family: Roboto;
  height: 70px;
  margin: 15px 20px 0 20px;
  border: 1px solid #eeeeee;
  line-height: 1.38;
  display: flex;
  align-items: center;
`;

export const ImageSection = styled.div`
  width: 90px;
  padding: 10px 20px;
`;

export const ContentSection = styled.div`
  width: 228px;
  height: 35px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  > div {
    width: 100%;
  }
`;

export const Title = styled.div`
  font-weight: bold;
  padding-bottom: 5px;
`;

export const Contents = styled.div`
  font-weight: 400;
`;
