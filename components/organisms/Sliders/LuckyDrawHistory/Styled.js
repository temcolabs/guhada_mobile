import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  height: 435px;
  background-color: #232323;
  text-align: center;
`;

export const Title = styled.div`
  color: #fff;
  font-family: BebasNeue-Bold;
  font-size: 38px;
  line-height: 1.11;
  padding-top: 50px;
  padding-bottom: 40px;
`;

export const SliderSection = styled.div`
  height: 268px;
  margin-bottom: 70px;
`;

export const SliderScrollSection = styled.div`
  width: 600px;
  height: 141px;
  transform: translate(-50%, -50%);
  height: 4px;
  border: 1px solid white;
  position: absolute;
  left: 50%;
  right: 50%;
`;

export const SliderScroll = styled.table`
  width: 100%;
  height: 2px;
  border: 1px solid #444444;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const SliderScrollItem = styled.td`
  width: ${(props) => props.width};
  height: 2px;
  background-color: ${(props) => props.bgColor};
  cursor: pointer;
`;
