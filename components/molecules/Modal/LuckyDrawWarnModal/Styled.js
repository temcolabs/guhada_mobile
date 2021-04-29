import styled from 'styled-components';

export const Wrapper = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  width: 400px;
  height: 383px;
`;

export const CloseButton = styled.button`
  width: 29px;
  height: 29px;
  background-image: url(${(props) => props.imageUrl});
  background-size: contain;
  position: absolute;
  top: 30px;
  left: 341px;
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
