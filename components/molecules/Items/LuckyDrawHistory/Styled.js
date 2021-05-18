import styled from 'styled-components';

export const Wrapper = styled.div`
  background-color: #232323;
  font-family: 'Roboto';
  width: 150px;
  height: 205px;
  text-align: center;
  margin-right: 8px;
`;
export const ImageSection = styled.div`
  position: relative;
  background-color: ${(props) => props.bgColor || 'white'};
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 20px;
`;

export const ImageSectionCover = styled.div`
  background-color: #222222;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  opacity: 0.4;
`;

export const Image = styled.img`
  width: 102.6px;
  height: 102.6px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const WinnerDate = styled.div`
  color: #ffffff;
  font-size: 14px;
  line-height: 1.14;
  height: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  p {
    margin: 0;
  }
`;

export const WinnerSubmit = styled.button`
  color: #eeeeee;
  font-size: 12px;
  width: 86px;
  height: 35px;
  border: 1px solid #444444;
`;
