import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

export const Item = styled.div`
  display: flex;
  border: solid 1px #eeeeee;
  border-radius: 11px;
  height: 22px;
  margin-top: 6px;
  margin-right: 6px;
  padding: 5px 14px 4px 10px;

  > div {
    font-family: Roboto;
    font-size: 11px;
  }
  > div:first-child {
    padding-right: 6px;
    border-right: 1px solid #dddddd;
    color: #444444;
  }
  > div:last-child {
    margin-left: 6px;
    color: #5d2ed1;
  }
`;
