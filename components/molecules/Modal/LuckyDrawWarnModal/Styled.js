import styled from 'styled-components';

export const Wrapper = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  width: 100%;
  height: 370px;
`;

export const CloseButton = styled.button`
  width: 20px;
  height: 20px;
  background-image: url(${(props) => props.imageUrl});
  background-size: contain;
  position: absolute;
  top: 20px;
  right: 20px;
`;

export const SectionInfo = styled.div`
  width: 340px;
  position: relative;
  top: 50px;
  left: 30px;
`;

export const SectionInfoTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  line-height: 1.43;
  margin-bottom: 20px;
`;

export const SectionInfoContents = styled.div`
  font-size: 12px;
  line-height: 2.08;
`

export const SectionButton = styled.div`
  height: 63px;
  padding: 19px 171px 20px;
  background-color: ${(props) => (props.isActive ? '#232323' : '#ccc')};
  color: #fff;
  cursor: pointer;
  text-align: center;
`;

