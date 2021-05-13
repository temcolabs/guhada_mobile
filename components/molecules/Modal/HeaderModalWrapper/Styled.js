import styled from 'styled-components';

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 60px;
  padding: 15px 20px;
`;

export const HeaderTitle = styled.div`
  color: #111111;
  font-family: Roboto;
  font-size: 17px;
  font-weight: bolder;
  line-height: 2.94;
  letter-spacing: 0.51px;
`;

export const HeaderIcon = styled.div`
  width: 30px;
  height: 30px;
`;

export const Wrapper = styled.div`
  padding-top: 60px;
`;
