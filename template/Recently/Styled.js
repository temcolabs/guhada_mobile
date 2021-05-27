import styled from 'styled-components';

export const RecentlyWrapper = styled.div`
  font-family: Roboto;
  border-top: 1px solid #eeeeee;
  display: flex;
  flex-flow: row wrap;
`;

export const MenuSection = styled.div`
  width: 100%;
  padding: 13px 20px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: #111111;
`;

export const MenuCounts = styled.div`
  line-height: 1.48;
`;

export const MenuDeleteButton = styled.button`
  width: 80px;
  height: 30px;
  border: solid 1px #dddddd;
  line-height: 1.2;
`;

export const ContentSection = styled.div`
  margin: 0 5px;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
`;

export const ContentItem = styled.div`
  margin: 5px 5px;
  width: ${(props) => (props.length ? props.length + 'px' : '110px')};
  height: ${(props) => (props.length ? props.length + 'px' : '110px')};
`;

export const ContentDeleteButton = styled.div`
  position: relative;
  bottom: ${(props) => (props.length ? props.length + 'px' : '110px')};
  left: ${(props) => (props.length ? props.length - 26 + 'px' : '110px')};
`;

export const ContentEmpty = styled.div`
  width: 100%;
  height: calc(100vh - 168px);
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
`;

export const ContentEmptyCenter = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;

  > div:last-child {
    margin-top: 15px;
  }
`;

export const ContentEmptyItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
