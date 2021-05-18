import styled from 'styled-components';

export const Wrapper = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  text-align: center;
  height: ${(props) => (props.isBigModal ? '305px' : '205px')};
`;

export const SectionContents = styled.div`
  position: relative;
  height: ${(props) => (props.isBigModal ? '249px' : '149px')};
`;

export const CloseButtonSection = styled.div`
  display: flex;
  justify-content: flex-end;
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
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const SectionStatus = styled.div`
  height: 130px;
  position: relative;
`;

export const SectionStatusIconSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

export const SectionStatusIcon = styled.div`
  width: 70px;
  height: 70px;
  background-image: url(${(props) => props.imageUrl});
  background-size: contain;
`;

export const SectionTitle = styled.div`
  display: flex;
  justify-content: center;
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
  height: 63px;
  padding: 19px;
  background-color: ${(props) => (props.isActive ? '#232323' : '#ccc')};
  color: #fff;
  cursor: pointer;
`;
