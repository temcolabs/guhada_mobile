import styled from 'styled-components';

export const Wrapper = styled.div`
  font-family: Roboto;
  font-size: 13px;
  line-height: 1.38;
  margin: 0 20px;
  height: 36px;
  overflow: hidden;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  > span {
    margin-right: 5px;
  }
  &.more {
    color: #999999;
  }
`;

export const Title = styled.span`
  font-weight: bold;
`;

export const Contents = styled.span`
  font-weight: 400;
`;
