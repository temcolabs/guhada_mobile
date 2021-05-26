import styled from 'styled-components';

export const ReviewHashtagDetailWrapper = styled.div``;
export const Menus = styled.div`
  display: flex;
  height: 50px;
  border-top: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
  > button:first-child {
    border-right: 1px solid #eeeeee;
  }
`;

export const MenuItem = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.active ? '#111111' : '#aaaaaa')};
  width: 50%;
`;

export const Contents = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
`;

export const ContentItem = styled.div`
  width: 33%;
  height: 119px;
  border-right: ${(props) => props.index % 3 !== 0 && '1.5px solid white'};
  border-bottom: 1.5px solid white;
`;
