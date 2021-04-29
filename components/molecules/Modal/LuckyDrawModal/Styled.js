import styled from 'styled-components';

export const Wrapper = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  text-align: center;
  width: 400px;
  height: ${(props) => (props.isBigModal ? '321px' : '203px')};
`;

export const SectionContents = styled.div`
  position: relative;
  width: 400px;
  height: ${(props) => (props.isBigModal ? '258px' : '140px')};
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
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const SectionStatus = styled.div`
  height: 130px;
  margin-bottom: 10px;
  position: relative;
`;

export const SectionStatusIcon = styled.div`
  width: 70px;
  height: 70px;
  background-image: url(${(props) => props.imageUrl});
  background-size: contain;
  position: relative;
  left: 165px;
  right: 165px;
  margin-bottom: 20px;
`;
export const SectionTitle = styled.div`
  font-size: 27px;
  font-weight: bold;
  height: 40px;
  line-height: 0.74;
`;

export const SectionDescriptions = styled.div`
  font-size: 12px;
  line-height: 1.67;
`;

export const SectionButton = styled.div`
  width: 400px;
  height: 63px;
  padding: 19px 171px 20px;
  background-color: ${(props) => (props.isActive ? '#232323' : '#ccc')};
  color: #fff;
  cursor: pointer;
`;
